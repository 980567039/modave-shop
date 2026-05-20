"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImagePlus, ImageUp, Trash, TrashIcon } from 'lucide-react';
import React, { useState } from 'react'
import MediaLibrary from '../../mediaLibrary';
import Image from 'next/image';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import TrashButton from '../../trashButton';

export default function ProductGallery({ controller, setValue, getValues }) {
    const [openImageModal, setOpenImageModal] = useState(false);
    const [typeOfImage, setTypeOfImage] = useState("");

    const transformObject = (obj) => {
        const { id, ...rest } = obj;
        return {
          ...rest,
          _id: id
        };
      };
      


    const handlerSelectImage = (image) => {
        
        const transformImgId = transformObject(image);
        
        if (typeOfImage === "default") {
            setValue("defaultImage", transformImgId);
        }

        if (typeOfImage === "gallery") {
            setValue("imageGallery", [...getValues("imageGallery"), transformImgId]);
        }
        setOpenImageModal(false);
        setTypeOfImage("");
    }

    return (
        <div className='flex flex-col gap-3 p-5 border-[1px] rounded-3xl'>
            <div className='mb-2'>
                <h4 className='text-xl font-semibold'>产品图库</h4>
                <p className='text-xs text-muted-foreground'>缩略图和产品图库</p>
            </div>

            <FormField
                control={controller}
                name="defaultImage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>产品默认图片</FormLabel>
                        <FormControl>
                            <>
                                {field?.value?.url && <div className='flex gap-3 relative flex-wrap'>
                                    <img src={field?.value?.url || "https://dummyimage.com/200x300/000/fff"} alt="product name" width={200} height={300} />
                                    <TrashButton
                                        title="确定删除？"
                                        content="您确定要删除这张主要产品图片吗？"
                                        onContinue={() => setValue("defaultImage", {})}
                                    />
                                </div>}

                                {!field?.value?.url && <div onClick={() => {
                                    setOpenImageModal(true)
                                    setTypeOfImage("default")
                                }} className={`p-10 group border-dashed border-2 rounded-3xl text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75`}>
                                    <ImageUp className='text-muted-foreground w-10 h-10' strokeWidth={0.8} />

                                    <span>选择图片</span>

                                    <div className='flex flex-col gap-2'>
                                        <p className='text-muted-foreground text-xs font-normal'>点击此处上传图片</p>
                                        <p className='text-muted-foreground text-xs font-normal'>
                                            推荐图片大小：小于2MB
                                        </p>
                                    </div>
                                </div>}
                            </>
                        </FormControl>
                        {/* <FormDescription className="text-xs">
                            This is your public display product name. use a SEO friendly name for the better reach in search engine
                        </FormDescription> */}
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />



            <div className='mb-2'>
                <h5 className='text-md font-semibold'>图库图片</h5>
                <p className='text-xs text-muted-foreground'>添加产品图库图片</p>
            </div>


            <FormField
                control={controller}
                name="imageGallery"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <>
                                <div className='grid grid-cols-4 grid-flow-row gap-4'>
                                    {field?.value?.map((image, index) => (
                                        <div key={index} className='relative'>
                                            <div className='overflow-hidden rounded-lg relative h-[200px]'>
                                                <img src={image.url} alt={image.alt} width={300} height={300} className='w-[100%] h-[100%] absolute left-0 top-0 object-cover' />
                                            </div>
                                            <div className='absolute top-0 right-0 p-2'>
                                                <TrashButton
                                                    title="确定删除？"
                                                    content="您确定要删除这张图片吗？"
                                                    onContinue={() => {
                                                        const newImages = [...field.value]
                                                        newImages.splice(index, 1);
                                                        field.onChange(newImages);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {field?.value && field?.value.length < 4 && <div onClick={() => {
                                        setOpenImageModal(true);
                                        setTypeOfImage("gallery");
                                    }} className={`p-2 h-[200px] group border-dashed border-2 rounded-3xl text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75`}>
                                        <ImagePlus className='text-muted-foreground w-10 h-10' strokeWidth={0.8} />

                                        <span>选择图片</span>
                                    </div>}
                                </div>
                            </>
                        </FormControl>
                        <FormDescription className="text-xs flex flex-col gap-1">
                            <span>- 推荐图片大小：小于2MB</span>
                            <span>- 您最多可以选择4张图片</span>
                        </FormDescription>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />



            <Dialog open={openImageModal} onOpenChange={() => setOpenImageModal(false)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择图片</DialogTitle>
                        <p className='text-xs text-muted-foreground mb-3 block'>您可以从媒体库中选择图片，或者直接从本地电脑上传。</p>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={handlerSelectImage} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
