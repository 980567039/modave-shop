"use client";


import MediaLibrary from "@/app/components/mediaLibrary";
import TrashButton from "@/app/components/trashButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


export default function SiteMainLogo({ controller, setValue }) {

    const [openImageModal, setOpenImageModal] = useState(false);


    const handlerSelectImage = (image) => {
        setValue("mainLogo", image?.url);
        setOpenImageModal(false);
    }

    return (
        <>
            <FormField
                control={controller}
                name="mainLogo"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <>
                                <div className='grid grid-cols-4 grid-flow-row gap-4'>
                                    {field?.value && <div className='relative'>
                                        <div className='overflow-hidden rounded-lg relative h-[150px]'>
                                            <img src={field?.value} alt={"主标志"} width={100} height={100} className='w-[100%] h-[100%] absolute left-0 top-0 object-cover' />
                                        </div>
                                        <div className='absolute top-0 right-0 p-2'>
                                            <TrashButton
                                                title="您确定吗？"
                                                content="您确定要删除这张图片吗？"
                                                onContinue={() => {
                                                    field.onChange('');
                                                }}
                                            />
                                        </div>
                                    </div>}

                                    {!field?.value && <div onClick={() => {
                                        setOpenImageModal(true);
                                    }} className={`p-2 h-[150px] group border-dashed border-2 rounded-md text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75`}>
                                        <ImagePlus className='text-muted-foreground w-8 h-8' strokeWidth={0.8} />

                                        <span>选择图片</span>
                                    </div>}
                                </div>
                            </>
                        </FormControl>
                        <FormDescription className="text-xs flex flex-col gap-1">
                            <span>- 推荐图片大小：小于2MB</span>
                            <span>- 推荐图片宽高：200x80像素</span>
                        </FormDescription>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
            <Dialog open={openImageModal} onOpenChange={() => setOpenImageModal(false)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择主标志</DialogTitle>
                        <p className='text-xs text-muted-foreground mb-3 block'>您可以从媒体库中选择图片，或直接从本地电脑上传。</p>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={handlerSelectImage} />
                </DialogContent>
            </Dialog>
        </>
    )

}