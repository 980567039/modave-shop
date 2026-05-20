"use client";
import React, { useEffect, useState, useContext } from 'react'
import { Button } from '@/components/ui/button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageUp, Trash } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import MediaLibrary from '../../mediaLibrary';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TrashButton from '../../trashButton';
import AiGenerateContent from '../../aiGenerateContent';
import { AdminContext } from '@/app/contexts/adminContexts';
import { transformS3UrlsInObject } from '@/lib/common';

export default function SEODataCollector({
    formController,
    onSelectImage,
    closeModal,
    removeOgImage,
    onCloseModal = null,
    getValues,
    setValue,
    type,
    data
}) {
    const [openOgImageModal, setOpenOgImageModal] = useState(false);
    const { store } = useContext(AdminContext);


    const handlerOnSelectImage = (d) => {
        onSelectImage(d);
        setOpenOgImageModal(false);
    }

    const handlerAiContent = (d, type) => {
        setValue(type, d)
    }

    useEffect(() => {
        if (getValues('title') !== '') {
            setValue('seoTitle', `${getValues('title')} | ${store?.general?.storeTitle}`)
        }
    }, []);


    useEffect(() => {
        if (closeModal) {
            setOpenOgImageModal(!closeModal);
        }
    }, [closeModal]);


    useEffect(() => {
        
        if (data && Object.keys(data).length !== 0) {
            const reFormatImage = transformS3UrlsInObject(data);
            setValue("seoTitle", reFormatImage?.seoTitle || "")
            setValue("seoDescription", reFormatImage?.seoDescription || "")
            setValue("seoKeywords", reFormatImage?.seoKeywords || "")
            setValue("ogTitle", reFormatImage?.ogTitle || "")
            setValue("ogDescription", reFormatImage?.ogDescription || "")
            setValue("ogImage", reFormatImage?.ogImage || "")
        }
    }, [data]);

    return (
        <div className='space-y-3'>
            <FormField
                control={formController}
                name="seoTitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>标题</FormLabel>
                        <FormControl>
                            <Input placeholder="SEO友好的标题" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                            使用SEO友好且吸引眼球的标题。
                        </FormDescription>
                        <FormMessage className="text-xs" />
                        <div className='flex justify-end'>
                            <AiGenerateContent
                                buttonTitle="AI生成主标题"
                                customPrompt={`Modify this '${type === "category" ? `${getValues('title')} category` : getValues('title')}' title tag for a seo friendly title tag, and the store name is ${store?.general?.storeTitle}`}
                                type="seo"
                                limit={1500}
                                basedOn={type === "category" ? `category ${getValues('title')}` : getValues('title')}
                                onApply={(d) => handlerAiContent(d, 'seoTitle')}
                            />
                        </div>
                    </FormItem>
                )}
            />
            <FormField
                control={formController}
                name="seoDescription"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>元描述</FormLabel>
                        <FormControl>
                            <Textarea placeholder="元描述" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                        <div className='flex justify-end'>
                            <AiGenerateContent
                                buttonTitle="AI生成元描述"
                                customPrompt={`generate a seo friendly meta description for '${type === "category" ? `${getValues('title')} category` : getValues('title')}'  and make that under 300 characters`}
                                type="seo"
                                limit={300}
                                basedOn={type === "category" ? `category ${getValues('title')}` : getValues('title')}
                                onApply={(d) => handlerAiContent(d, 'seoDescription')}
                            />
                        </div>
                    </FormItem>
                )}
            />
            <FormField
                control={formController}
                name="seoKeywords"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>元关键词</FormLabel>
                        <FormControl>
                            <Textarea placeholder="元关键词" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                        <div className='flex justify-end'>
                            <AiGenerateContent
                                buttonTitle="AI生成元关键词"
                                customPrompt={`generate a seo friendly meta Keywords for '${type === "category" ? `${getValues('title')} category` : getValues('title')}' and make that under 155-160 characters`}
                                type="seo"
                                limit={160}
                                basedOn={type === "category" ? `category ${getValues('title')}` : getValues('title')}
                                onApply={(d) => handlerAiContent(d, 'seoKeywords')}
                            />
                        </div>
                    </FormItem>
                )}
            />
            <hr />
            <div className='mb-2'>
                <h5 className='text-md font-semibold'>开放图谱数据</h5>
                <p className='text-xs text-muted-foreground'>所有与社交媒体相关的开放图谱(OG)数据。</p>
            </div>
            <FormField
                control={formController}
                name="ogTitle"
                render={({ field }) => (
                    <FormItem>
                        <div className='flex items-center justify-between'>
                            <FormLabel>OG标题</FormLabel>
                            <RainbowButton
                                className="text-sm p-2 h-auto flex items-center gap-2 rounded-2xl" 
                                onClick={() => setValue('ogTitle', getValues('seoTitle'))}
                            >
                                复制标题
                            </RainbowButton>
                        </div>
                        <FormControl>
                            <Input placeholder="OG标题" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                            此标题将显示在所有社交媒体共享片段中。因此，请使用SEO友好且吸引眼球的标题。
                        </FormDescription>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <FormField
                control={formController}
                name="ogDescription"
                render={({ field }) => (
                    <FormItem>
                        <div className='flex items-center justify-between'>
                            <FormLabel>OG描述</FormLabel>
                            <RainbowButton
                                className="text-sm p-2 h-auto flex items-center gap-2 rounded-2xl" 
                                onClick={() => setValue('ogDescription', getValues('seoDescription'))}
                            >
                                复制元描述
                            </RainbowButton>
                        </div>
                        <FormControl>
                            <Textarea placeholder="OG描述" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                            此标题将作为描述显示在所有社交媒体共享片段中。
                        </FormDescription>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />

            <FormField
                control={formController}
                name="ogImage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>OG图片</FormLabel>
                        <FormControl>
                            <>
                                {field.value && <div className='flex gap-3 relative flex-wrap'>
                                    <img src={field.value || "https://dummyimage.com/200x300/000/fff"} alt="OG图片" width={200} height={300} />
                                    <div className='absolute left-3 top-3'>
                                        <TrashButton
                                            title="您确定吗？"
                                            content="您确定要删除这张图片吗？"
                                            onContinue={removeOgImage}
                                        />
                                    </div>
                                </div>}

                                {!field.value && <div onClick={() => setOpenOgImageModal(true)} className={`p-10 group border-dashed border-2 rounded-3xl text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75`}>
                                    <ImageUp className='text-muted-foreground w-10 h-10' strokeWidth={0.8} />

                                    <span>选择OG图片</span>

                                    <div className='flex flex-col gap-2'>
                                        <p className='text-muted-foreground text-xs font-normal'>点击此处选择或上传图片</p>
                                        <p className='text-muted-foreground text-xs font-normal'>
                                            推荐图片大小：小于2MB
                                        </p>
                                    </div>
                                </div>}
                                <Input placeholder="OG图片" {...field} className="hidden" />
                            </>
                        </FormControl>
                        <FormDescription className="text-xs">
                            此图片将作为主图显示在所有社交媒体共享片段中。
                        </FormDescription>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />


            <Dialog open={openOgImageModal} onOpenChange={() => {
                setOpenOgImageModal(false);
                // onCloseModal(true);
            }}>
                <DialogContent className="min-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>选择OG图片？</DialogTitle>
                        <DialogDescription>
                            您选择的图片将作为主图显示在所有社交媒体共享片段中。
                        </DialogDescription>
                    </DialogHeader>

                    <MediaLibrary selectedMedia={handlerOnSelectImage} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
