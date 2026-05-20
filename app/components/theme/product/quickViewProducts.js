"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Eye, Plus } from 'lucide-react';
import React, { useState } from 'react'
import ProductDescriptions from './productDescriptions';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';
import { getTypeOfAttribute, onlyFirstLetter } from '@/lib/common';
import ProductQuickView from './productQuickView';
import { useRouter } from 'next/navigation';

export default function QuickViewProducts({ data }) {
    const [openModal, setOpenModal] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const getSizes = getTypeOfAttribute(data, 'size');
    const router  = useRouter();

    return (
        <div className='w-full'>
            {getSizes && getSizes.length > 0 && getSizes.every(item => item !== "") && <div className='hidden w-max mx-auto border-[1px] border-white/20 rounded-md items-center backdrop-blur-md mb-3 bg-black/25 text-white font-semibold xl:flex text-[10px]'>
                {getSizes.length <= 4 ? (
                    getSizes.map((d, i) => (
                        <div key={i} className={`w-auto text-center p-3 ${i !== getSizes.length - 1 ? 'border-r-[1px]' : ''} border-white/20 uppercase`}>
                            {onlyFirstLetter(d?.value?.replace('-', ' '))}
                        </div>
                    ))
                ) : (
                    <>
                        {getSizes.slice(0, 2).map((d, i) => (
                            <div key={i} className="w-auto text-center p-3 border-r-[1px] border-white/20 uppercase">
                                {d?.value?.replace('-', ' ')}
                            </div>
                        ))}
                        <div className="w-auto text-center p-3 border-r-[1px] border-white/20 uppercase">....</div>
                        <div className="w-auto text-center p-3 uppercase">
                            {getSizes[getSizes.length - 1]?.value?.replace('-', ' ')}
                        </div>
                    </>
                )}
            </div>}

            <Button onClick={() => router.push(`/product/${data?.titleSlug}`)} className="rounded-2xl md:rounded-md w-full uppercase tracking-widest text-xs bg-black/50 backdrop-blur-xl hover:bg-black/70 border-[1px] border-black/5 h-[30px] md:h-[40px]">
                Quick View
                <Plus className='w-4 h-4' />
            </Button>

            {isDesktop ? <>
                <Dialog open={openModal} onOpenChange={() => setOpenModal(false)} className="rounded-none">
                    <DialogContent className="rounded-3xl md:rounded-3xl max-w-[80vw] lg:max-w-[60vw] xl:max-w-[70vw] max-h-[90vw] overflow-y-auto p-0">
                        <DialogTitle className="hidden"></DialogTitle>
                        <ProductQuickView data={data} initialData={data} />
                        {/* <ProductDescriptions data={data} params={null} quickView={true} initialData={data} /> */}
                    </DialogContent>
                </Dialog>

            </> : <>
                <Drawer open={openModal} onOpenChange={() => setOpenModal(false)}>
                    <DrawerContent className="rounded-none md:rounded-none">
                        <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
                            {/* <ProductDescriptions data={data} params={null} quickView={true} initialData={data} /> */}
                        </div>
                        <DrawerFooter className="pt-2">
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>}



        </div>
    )
}
