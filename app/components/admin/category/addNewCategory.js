"use client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import SEODataCollector from '../seo/seoDataCollector';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import TrashButton from '../../trashButton';
import { AlertCircle, Check, ChevronsUpDown, ImageUp, LoaderCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MediaLibrary from '../../mediaLibrary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiReq, transformS3UrlsInObject } from '@/lib/common';
import { toast } from 'sonner';

import ParentCategorySelection from './parentCategorySelection';


const categoryFormSchema = z.object({
    title: z.string().min(2, {
        message: "分类名称必须至少包含2个字符。",
    }),
    slug: z.string().min(2, {
        message: "别名必须至少包含2个字符。",
    }),
    url: z.string().optional(),
    description: z.string().optional(),
    customCategoryTitle: z.string().optional(),
    categoryImage: z.string().optional(),
    categoryFeaturedImage: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().max(300, {
        message: "谷歌建议元描述最多包含300个字符，以确保在搜索结果中最佳显示。",
    }).optional(),
    seoKeywords: z.string().max(160, {
        message: "谷歌建议元关键词最多包含155-160个字符，以确保在搜索结果中最佳显示。",
    }).optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().max(300, {
        message: "谷歌建议元描述最多包含300个字符，以确保在搜索结果中最佳显示。",
    }).optional(),
    ogImage: z.string().optional(),
    parentId: z.string().optional(),
})

export default function AddNewCategory({ onSubmit, onCloseSheet, edit }) {
    const [openImageModal, setOpenImageModal] = useState(false);
    const [activeImageField, setActiveImageField] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [categoryFeaturedImage, setCategoryFeaturedImage] = useState('');
    const [selectedOgImage, setSelectedOgImage] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState({});
    const [closeOgModal, setCloseOgModal] = useState(false);
    const [slugString, setSlugString] = useState("");
    const [selectedParent, setSelectedParent] = useState(null);

    const { control: categoryController, handleSubmit: categorySubmit, setValue, reset, clearErrors, formState: { errors }, getValues } = useForm({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            title: "",
            slug: "",
            url: "",
            categoryImage: "",
            categoryFeaturedImage: "",
            customCategoryTitle: "",
            description: "",
            seoTitle: "",
            seoDescription: "",
            seoKeywords: "",
            ogTitle: "",
            ogDescription: "",
            ogImage: "",
            parentId: "",
        }
    });

    console.log("edit===", edit);
    

    const handlerCategoryNameChange = (val) => {
        const cleanedStr = val.replace(/[^\w\s]/gi, '');
        // Replace spaces with hyphens
        const hyphenatedStr = cleanedStr.replace(/\s+/g, '-');
        const lowerSlug = hyphenatedStr.toLowerCase();

        let urlValues;

        if (selectedParent && selectedParent?.catObject !== undefined && Object.keys(selectedParent?.catObject).length !== 0) {
            urlValues = selectedParent?.catObject?.url + "/" + lowerSlug
        } else {
            urlValues = "/" + lowerSlug;
        }

        setValue('slug', lowerSlug);
        setSlugString(lowerSlug)
        // setValue("url", urlValues)
        clearErrors("slug");
    }

    const handlerOnSelectImage = (d) => {
        if (activeImageField === 'categoryImage') {
            setValue("categoryImage", d.url);
            setCategoryImage(d);
        } else if (activeImageField === 'categoryFeaturedImage') {
            setValue("categoryFeaturedImage", d.url);
            setCategoryFeaturedImage(d);
        }
        setOpenImageModal(false);
    }

    const onError = (errors) => {
        setFormErrors(errors);
        console.log("errors", errors);
    };

    const handlerSelectOgImage = (d) => {
        setValue("ogImage", d.url);
        setSelectedOgImage(d);
        setCloseOgModal(true);
    }

    const onSubmitForm = async (values) => {
        const payload = {
            ...values,
            ...(values.categoryImage && { categoryImage }),
            ...(values.categoryFeaturedImage && { categoryFeaturedImage }),
            ...(values.ogImage && { ogImage: selectedOgImage?.url }),
        }

        // clear errors
        setFormErrors({})

        try {
            setIsLoading(true);

            let res;
            if (edit && Object.keys(edit).length !== 0) {
                const updatedPayload = {
                    ...payload,
                    id: edit?._id
                }
                res = await apiReq('admin/product/category', 'PUT', updatedPayload);
            } else {
                res = await apiReq('admin/product/category', 'POST', payload);
            }

            if (res && res.status) {
                const { data } = await res.json();
                toast.success("Success", {
                    description: `Successfully ${isEdit ? "updated" : "created"} "${values.title}" category`,
                });

                clearInputs();
                setIsLoading(false);
                onSubmit(data);
            }

        } catch (error) {
            console.log("error ==", error);
            toast.error("Something went wrong!", {
                description: "Please try again later"
            })
        } finally {
            setIsLoading(false);
        }
    }

    const clearInputs = () => {
        reset();
        setValue('slug', '');
        onCloseSheet(true);
        setSelectedOgImage({})
        setCategoryImage({});
        setCategoryFeaturedImage({});
    };

    const renderErrorMsg = (key) => {
        switch (key) {
            case "title":
                return "请检查分类标题"
            case "seoDescription":
            case "slug":
                return "请检查分类别名"
            case "seoDescription":
                return "请检查元描述"
            case "seoKeywords":
                return "请检查元关键词"
            case "ogDescription":
                return "请检查开放图谱描述"
            default:
                return "";
        }
    }

    useEffect(() => {
        if (edit && Object.keys(edit).length !== 0) {
            
            setIsEdit(true);
            setValue("title", edit?.title?.replace("-", "") || "")
            setValue("slug", edit?.slug || "")
            setValue("url", edit?.url || "")
            setValue("categoryImage", edit?.categoryImage?.url || "")
            setValue("categoryFeaturedImage", edit?.categoryFeaturedImage?.url || "")
            setValue("description", edit?.description || "")
            setValue("customCategoryTitle", edit?.customCategoryTitle || "")
            setValue("seoTitle", edit?.seoTitle || "")
            setValue("seoDescription", edit?.seoDescription || "")
            setValue("seoKeywords", edit?.seoKeywords || "")
            setValue("ogTitle", edit?.ogTitle || "")
            setValue("ogDescription", edit?.ogDescription || "")
            setValue("ogImage", edit?.ogImage?.url || "")
            setValue("parentId", edit?.parentId || "")


            
            // Set state for the images if available
            if (edit?.categoryImage) {
                setCategoryImage(edit.categoryImage);
            }
            if (edit?.categoryFeaturedImage) {
                setCategoryFeaturedImage(edit.categoryFeaturedImage);
            }
            if (edit?.ogImage) {
                setSelectedOgImage(edit.ogImage);
            }
        }
        return () => {
            setIsEdit(false);
        }
    }, [edit, setValue]);

    return (
        <div className='flex flex-col gap-5'>
            {errors && Object.keys(errors).length !== 0 && <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-xs">以下输入中存在错误</AlertTitle>
                <AlertDescription className="text-xs">
                    <ul>
                        {Object.keys(errors).map((key, index) => (
                            <li key={index}>- {renderErrorMsg(key)}</li>
                        ))}
                    </ul>
                </AlertDescription>
            </Alert>}

            <Form {...categoryController}>
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-full">
                        <TabsTrigger value="basic" className="rounded-full">基本信息</TabsTrigger>
                        <TabsTrigger value="seo" className="rounded-full">SEO</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                        <div className="space-y-5">
                            <FormField
                                control={categoryController}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>分类名称</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="分类名称"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handlerCategoryNameChange(e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            这是公开显示的分类名称。使用对SEO友好的名称以便在搜索引擎中获得更好的曝光。
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={categoryController}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>别名</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="别名"
                                                {...field}
                                                onChange={(e) => {
                                                    const cleanedStr = e.target.value.replace(/[^\w\s]/gi, '-');
                                                    const slugVal = cleanedStr.replace(/\s+/g, '-').toLowerCase();

                                                    let urlValues;

                                                    if (selectedParent && selectedParent?.catObject !== undefined && Object.keys(selectedParent?.catObject).length !== 0) {
                                                        urlValues = selectedParent?.catObject?.url + "/" + slugVal
                                                    } else {
                                                        urlValues = "/" + slugVal;
                                                    }

                                                    // setValue("url", urlValues)

                                                    field.onChange(slugVal);
                                                    setSlugString(slugVal)
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            此分类的别名将自动生成，并将作为分类的URL。
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={categoryController}
                                name="customCategoryTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>自定义分类标题</FormLabel>
                                        <FormControl>
                                            <Input placeholder="自定义分类标题" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            这将在分类页面中显示为分类标题。
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={categoryController}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>描述</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="分类描述" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            *这是可选项
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={categoryController}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        {console.log("field===", field)}
                                        <FormControl>
                                            <Input
                                                placeholder="分类URL"
                                                {...field}
                                                disabled
                                                className="pointer-events-none"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            此分类的URL将自动生成。
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={categoryController}
                                name="parentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>父级</FormLabel>
                                        <FormControl>
                                            <>
                                                <ParentCategorySelection onChangeValue={(d, catObject) => {
                                                    setValue("parentId", d);
                                                    // setValue("url", d !== "" ? catObject?.url + "/" + slugString : "/" + slugString);
                                                    setSelectedParent({ d, catObject })
                                                }} edit={edit} />

                                                <Input
                                                    placeholder="父级ID"
                                                    {...field}
                                                    className="hidden"
                                                />
                                            </>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={categoryController}
                                name="categoryImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>分类图片</FormLabel>
                                        <FormControl>
                                            <>
                                                {field.value && <div className='flex gap-3 relative flex-wrap'>
                                                    <img src={field.value || "https://dummyimage.com/200x300/000/fff"} alt={"分类图片"} width={200} height={300} />
                                                    <div className='absolute left-3 top-3'>
                                                        <TrashButton
                                                            title="确定吗？"
                                                            content="您确定要删除此图片吗？"
                                                            onContinue={() => setValue("categoryImage", '')}
                                                        />
                                                    </div>
                                                </div>}

                                                {!field.value && <div 
                                                    onClick={() => {
                                                        setActiveImageField('categoryImage');
                                                        setOpenImageModal(true);
                                                    }} 
                                                    className={`p-10 group border-dashed border-2 rounded-3xl text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75`}
                                                >
                                                    <ImageUp className='text-muted-foreground w-10 h-10' strokeWidth={0.8} />

                                                    <span>选择分类图片</span>

                                                    <div className='flex flex-col gap-2'>
                                                        <p className='text-muted-foreground text-xs font-normal'>点击此处选择或上传图片</p>
                                                        <p className='text-muted-foreground text-xs font-normal'>
                                                            推荐图片尺寸1300x400像素：小于2MB
                                                        </p>
                                                    </div>
                                                </div>}
                                                <Input placeholder="分类图片" {...field} className="hidden" />
                                            </>
                                        </FormControl>
                                        {field.value && <FormDescription className="text-xs">
                                            此图片将显示为分类图片。
                                        </FormDescription>}
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={categoryController}
                                name="categoryFeaturedImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>分类特色图片</FormLabel>
                                        <FormControl>
                                            <>
                                                {field.value && <div className='flex gap-3 relative flex-wrap'>
                                                    <img src={field.value || "https://dummyimage.com/200x300/000/fff"} alt={"分类特色图片"} width={200} height={300} />
                                                    <div className='absolute left-3 top-3'>
                                                        <TrashButton
                                                            title="确定吗？"
                                                            content="您确定要删除此图片吗？"
                                                            onContinue={() => setValue("categoryFeaturedImage", '')}
                                                        />
                                                    </div>
                                                </div>}

                                                {!field.value && <div 
                                                    onClick={() => {
                                                        setActiveImageField('categoryFeaturedImage');
                                                        setOpenImageModal(true);
                                                    }} 
                                                    className={`p-10 group border-dashed border-2 rounded-3xl text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75 w-[50%]`}
                                                >
                                                    <ImageUp className='text-muted-foreground w-10 h-10' strokeWidth={0.8} />

                                                    <span>选择分类特色图片</span>

                                                    <div className='flex flex-col gap-2'>
                                                        <p className='text-muted-foreground text-xs font-normal'>点击此处选择或上传图片</p>
                                                        <p className='text-muted-foreground text-xs font-normal'>
                                                            推荐图片尺寸600x700像素：小于2MB
                                                        </p>
                                                    </div>
                                                </div>}
                                                <Input placeholder="分类特色图片" {...field} className="hidden" />
                                            </>
                                        </FormControl>
                                        {field.value && <FormDescription className="text-xs">
                                            此图片将显示为分类特色图片。
                                        </FormDescription>}
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </TabsContent>
                    <TabsContent value="seo" className="space-y-4">
                        <SEODataCollector
                            getValues={getValues}
                            setValue={setValue}
                            formController={categoryController}
                            onSelectImage={handlerSelectOgImage}
                            closeModal={closeOgModal}
                            removeOgImage={() => setValue("ogImage", '')}
                            type="category"
                            data={edit || {}}
                        />
                    </TabsContent>

                </Tabs>

                <div className='flex items-center justify-end'>
                    <Button type="button" onClick={categorySubmit(onSubmitForm, onError)} disabled={isLoading}>
                        {isLoading ? <>
                            <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                            {edit && Object.keys(edit).length !== 0 ? '更新中' : "创建中"}
                        </> : <>
                            {edit && Object.keys(edit).length !== 0 ? '更新分类' : "创建分类"}
                        </>}
                    </Button>
                </div>
            </Form>

            <Dialog open={openImageModal} onOpenChange={() => setOpenImageModal(false)}>
                <DialogContent className="min-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>
                            {activeImageField === 'categoryImage' 
                                ? '选择分类图片' 
                                : '选择分类特色图片'}
                        </DialogTitle>
                        <DialogDescription>
                            {activeImageField === 'categoryImage' 
                                ? '推荐尺寸：1300x400像素（小于2MB）' 
                                : '推荐尺寸：600x700像素（小于2MB）'}
                        </DialogDescription>
                    </DialogHeader>

                    <MediaLibrary selectedMedia={handlerOnSelectImage} />
                </DialogContent>
            </Dialog>
        </div>
    )
}