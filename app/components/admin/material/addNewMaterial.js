"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { LoaderCircle, Plus } from 'lucide-react';
import React, { useContext, useState } from 'react'
import MediaLibrary from '../../mediaLibrary';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import TrashButton from '../../trashButton';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { apiReq, generateSlug } from '@/lib/common';
import { toast } from 'sonner';
import { AdminContext } from '@/app/contexts/adminContexts';

export default function AddNewMaterial({ open, onClose }) {
    const [openMedia, setOpenMedia] = useState(false);
    const [selectedImage, setSelectedImage] = useState({});
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { setMaterial } = useContext(AdminContext);

    const handlerAddNewMaterial = async () => {
        if (title && title.length > 2) {
            // Add new material to database
            try {
                setIsLoading(true);

                const payload = {
                    title,
                    slug: generateSlug(title),
                    image: selectedImage
                }


                const res = await apiReq("admin/product/material", "POST", payload);

                if (res && res.status === 200) {
                    onClose(true);
                    const { data } = await res.json();

                    setMaterial((prevState) => ([
                        ...prevState,
                        data
                    ]))

                    toast.success("创建成功！", {
                        description: "成功创建新材料。"
                    })
                }

                

            } catch (error) {
                console.log(error);
                setIsLoading(false);
                toast.error("出现错误！", {
                    description: "请稍后再试"
                })
            } finally {
                setIsLoading(false);
            }
        } else {
            setTitleError(true);
        }
    }

    const handlerSelectImage = (image) => {
        setSelectedImage(image)
        setOpenMedia(false)
    }
    return (
        <div>
            <AlertDialog open={open} onOpenChange={onClose}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>添加新材料</AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作无法撤消。这将永久删除您的账户
                            并从我们的服务器中删除您的数据。

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-2 items-start'>
                            <div className='flex gap-3'>
                                {selectedImage && selectedImage?.url ? <>
                                    <div className='overflow-hidden rounded-lg'>
                                        <img src={selectedImage?.url} alt="" width={80} height={50} />
                                    </div>
                                    <TrashButton
                                        title="您确定吗？"
                                        content="您确定要删除这张图片吗？"
                                        onContinue={() => setSelectedImage({})}
                                    />
                                </> : <>
                                    <div onClick={() => setOpenMedia(true)} className='border-[2px] border-dashed w-[80px] h-[50px] rounded-lg flex items-center justify-center flex-col hover:border-gray-400 cursor-pointer'>
                                        <Plus className='text-muted-foreground w-5 h-5' />
                                        <p className='text-xs text-muted-foreground'>图片</p>
                                    </div>
                                </>}
                            </div>
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            setTitleError(false);
                                        }}
                                        placeholder="材料名称" />
                                </FormControl>
                                {titleError && <FormMessage className="text-xs">材料名称不能为空或至少需要超过2个字符</FormMessage>}
                            </FormItem>

                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <Button type="button" onClick={handlerAddNewMaterial} disabled={isLoading}>
                            {isLoading ? <>
                                <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                                添加材料
                            </> : <>
                                添加材料
                            </>}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={openMedia} onOpenChange={() => setOpenMedia(false)}>
                <DialogContent className="min-w-[850px]">
                    <DialogHeader>
                        <DialogTitle>选择材料图片</DialogTitle>
                        <DialogDescription>
                            请选择一张材料图片，以便更容易识别产品的材料。
                        </DialogDescription>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={handlerSelectImage} />
                </DialogContent>
            </Dialog>



        </div>
    )
}
