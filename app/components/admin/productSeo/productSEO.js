"use client";

import React, { useState } from 'react'
import SEODataCollector from '../seo/seoDataCollector'

export default function ProductSEO({
    controller,
    setValue,
    getValues
}) {
    const [closeOgModal, setCloseOgModal] = useState(false);

    const handlerSelectOgImage = (image) => {
        setValue("ogImage", image?.url);
        setCloseOgModal(true);
    }
    return (
        <div className='space-y-5 p-5 border-[1px] rounded-3xl'>
            <div className='mb-2'>
                <h4 className='text-xl font-semibold'>产品 SEO</h4>
                <p className='text-xs text-muted-foreground'>管理所有与 SEO 相关的数据</p>
            </div>

            <SEODataCollector 
                formController={controller} 
                onSelectImage={handlerSelectOgImage} 
                getValues={getValues}
                setValue={setValue}
                removeOgImage={() => {
                    setValue("ogImage", "");
                    setCloseOgModal(false)
                }} 
                closeModal={closeOgModal}
            />
        </div>
    )
}
