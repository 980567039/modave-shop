"use client";

import SearchAndAddProduct from '@/app/components/admin/theme/searchAndAddProduct';
import MediaLibrary from '@/app/components/mediaLibrary';
import TrashButton from '@/app/components/trashButton';
import { AdminContext } from '@/app/contexts/adminContexts';
import useSubmitThemeForm from '@/app/hooks/useSubmitThemeForm';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { apiReq } from '@/lib/common';
import { ImagePlus, LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner';

export default function ThemeTrending() {
    const { isLoading, handleSubmitForm } = useSubmitThemeForm();

    const [sectionTitle, setSectionTitle] = useState('');
    const [leftImage, setLeftImage] = useState('');
    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const { store, setStore } = useContext(AdminContext);


    const handlerSelectImage = (image) => {
        setLeftImage(image?.url);
        setOpenImageModal(false);
    }


    const handlerSubmitForm = () => {
        
        const payload = {
            trending: {
                sectionTitle,
                leftImage,
                selectedProducts
            },
            storeId: store?._id,
        };

        handleSubmitForm(
            'admin/store/theme', // 动态URL
            'POST', // HTTP方法
            payload, // 动态载荷
            (data) => {
                setStore((prevState) => ({
                    ...prevState,
                    theme: {
                        ...prevState?.theme,
                        trending: {
                            ...payload?.trending
                        }
                    },
                }));
            }
        );

    }


    useEffect(() => {
        if (store && store?.theme && store?.theme?.trending) {
            
            setSelectedProducts(store?.theme?.trending?.selectedProducts || []);
            setLeftImage(store?.theme?.trending?.leftImage || '');
            setSectionTitle(store?.theme?.trending?.sectionTitle || '');
        }
    }, [store]);

    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-semibold text-xl">首页热门趋势(注：展示在首页分类下方)</h2>
                <p className="text-muted-foreground text-sm">整理所有最佳热门产品，以便在首页上突出显示。</p>
            </div>

            <div className="flex items-start gap-3">

                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">区域标题</label>
                    <Input
                        type="text"
                        placeholder="区域标题"
                        value={sectionTitle}
                        onChange={(e) => setSectionTitle(e.target.value)}
                    />

                    <div className='grid grid-cols-4 grid-flow-row gap-4'>
                        {leftImage && <div className='relative'>
                            <div className='overflow-hidden rounded-lg relative h-[450px]'>
                                <img src={leftImage} alt={"主标志"} width={100} height={100} className='w-[100%] h-[100%] absolute left-0 top-0 object-cover' />
                            </div>
                            <div className='absolute top-0 right-0 p-2'>
                                <TrashButton
                                    title="您确定吗？"
                                    content="您确定要删除这张图片吗？"
                                    onContinue={() => {
                                        setLeftImage('');
                                    }}
                                />
                            </div>
                        </div>}

                        {!leftImage && <div onClick={() => {
                            setOpenImageModal(true);
                        }} className={`p-2 h-[150px] group border-dashed border-2 rounded-md text-center flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-all ease-in-out delay-75`}>
                            <ImagePlus className='text-muted-foreground w-8 h-8' strokeWidth={0.8} />

                            <span>选择图片</span>
                        </div>}
                    </div>

                    <SearchAndAddProduct onSelect={(d) => setSelectedProducts(d)} isAutoFetch={false} max={4} findKey={'trending'} />
                </div>

            </div>


            <div className="flex justify-end">
                <Button type="button" onClick={handlerSubmitForm} disabled={isLoading}>
                    {isLoading ? <>
                        <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                        保存中
                    </> : <>
                        保存
                    </>}
                </Button>
            </div>

            <Dialog open={openImageModal} onOpenChange={() => setOpenImageModal(false)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择主标志</DialogTitle>
                        <p className='text-xs text-muted-foreground mb-3 block'>您可以从媒体库中选择图片或直接从本地电脑上传。</p>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={handlerSelectImage} />
                </DialogContent>
            </Dialog>

        </div>
    )
}
