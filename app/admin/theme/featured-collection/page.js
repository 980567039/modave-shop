"use client";
import CategoriesSelection from '@/app/components/admin/theme/categoriesSelection';
import MediaLibrary from '@/app/components/mediaLibrary';
import { AdminContext } from '@/app/contexts/adminContexts';
import useSubmitThemeForm from '@/app/hooks/useSubmitThemeForm';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Minus, PlusIcon, Undo2 } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'

export default function ThemeFeaturedCollection() {
    const { store, setStore } = useContext(AdminContext);
    const [openMedia, setOpenMedia] = useState(false);

    const { isLoading, handleSubmitForm } = useSubmitThemeForm();

    const [data, setData] = useState({
        featuredImage: false,
        mainTitle: '',
        tagline: '',
        items: [],
    });


    const handlerSubmitForm = async () => {
        const payload = {
            featuredCollection: data,
            storeId: store?._id,
        };

        handleSubmitForm(
            'admin/store/theme', // 动态URL
            'POST', // HTTP方法
            payload, // 动态载荷
            (data) => {
                setStore((prevState) => ({
                    ...prevState,
                    theme: data,
                }));
            }
        );
    }

    useEffect(() => {
        if (store && store?.theme && store?.theme?.featuredCollection) {
            setData({...store?.theme?.featuredCollection});
        }
    }, [store]);



    return (
        <div className="space-y-5 mb-5">
            <div>
                <h2 className="font-semibold text-xl">精选系列</h2>
                <p className="text-muted-foreground text-sm">填写精选系列部分</p>
            </div>

            <div className="space-y-3 w-full">

                <label className="text-sm font-semibold">精选图片</label>
                <div onClick={() => !data?.featuredImage ? setOpenMedia(true) : {}} className='w-full  border-dashed border-2 rounded-md flex items-center justify-center hover:border-primary cursor-pointer transition-all ease-in-out delay-75'>
                    {data?.featuredImage ? <>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full">
                                <Image src={data?.featuredImage} alt={`featured_image`} width={1000} height={700} className="w-full h-auto" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setData({
                                    ...data,
                                    featuredImage: false
                                })} className="text-sm cursor-pointer text-red-500 flex gap-1">
                                    <Minus className='w-4 h-4' />
                                    <span className='text-xs'>移除</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-sm cursor-pointer flex gap-1" onClick={() => setOpenMedia(true)}>
                                    <Undo2 className='w-4 h-4' />
                                    <span className='text-xs'>替换图片</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </> :
                        <AspectRatio ratio={1 / 1}>
                            <div className="py-10 flex flex-col items-center justify-center gap-3 h-full">
                                <div className="flex items-center gap-5">
                                    <PlusIcon className='w-5 h-5 text-muted-foreground' />
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-xs text-muted-foreground">点击添加图片</span>
                                    <span className="text-xs text-muted-foreground">图片尺寸：1000x1300像素</span>
                                </div>
                            </div>
                        </AspectRatio>
                    }
                </div>
            </div>

            <div className='flex items-center gap-3'>
                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">主标题</label>
                    <Input
                        value={data?.mainTitle}
                        placeholder="主标题"
                        onChange={(e) => setData((prevData) => ({
                            ...prevData,
                            mainTitle: e.target?.value || ''
                        }))}
                    />
                </div>
                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">标语</label>
                    <Input
                        value={data?.tagline}
                        placeholder="标语"
                        onChange={(e) => setData((prevData) => ({
                            ...prevData,
                            tagline: e.target?.value || ''
                        }))}
                    />
                </div>
            </div>

            <div className="space-y-3 w-full">
                <label className="text-sm font-semibold">系列项目</label>
                <CategoriesSelection
                    onChange={(d) => setData((prevData) => ({
                        ...prevData,
                        items: d
                    }))} 
                    imageSize={"600x1000"}
                    max={4}
                    addNewText={"系列"}
                    hide={[ 'movingText', 'isMain']}
                    findBy={"featuredCollection"}
                />
            </div>


            <div className='flex items-center gap-3'>
                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">浏览全部链接</label>
                    <Input
                        value={data?.exploreAllLink}
                        placeholder="链接"
                        onChange={(e) => setData((prevData) => ({
                            ...prevData,
                            exploreAllLink: e.target?.value || ''
                        }))}
                    />
                </div>
                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">浏览全部按钮文本</label>
                    <Input
                        value={data?.exploreAllText}
                        placeholder="浏览全部按钮文本"
                        onChange={(e) => setData((prevData) => ({
                            ...prevData,
                            exploreAllText: e.target?.value || ''
                        }))}
                    />
                </div>
            </div>

            <div className="flex justify-end ">
                <Button type="button" onClick={handlerSubmitForm} disabled={isLoading}>
                    {isLoading ? <>
                        <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                        保存中
                    </> : <>
                        保存
                    </>}
                </Button>
            </div>

            <Dialog open={openMedia} onOpenChange={() => setOpenMedia(false)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择精选图片</DialogTitle>
                        <p className='text-xs text-muted-foreground mb-3 block'>您可以从媒体库中选择图片或直接从本地电脑上传。</p>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={(d) => {
                        setData({
                            ...data,
                            featuredImage: d?.url
                        });
                        setOpenMedia(false)
                    }} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
