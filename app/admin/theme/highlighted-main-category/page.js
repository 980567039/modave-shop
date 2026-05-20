"use client";

import CategoriesSelection from '@/app/components/admin/theme/categoriesSelection'
import FeaturedCategories from '@/app/components/admin/theme/featuredCategories';

import { AdminContext } from '@/app/contexts/adminContexts';
import useSubmitThemeForm from '@/app/hooks/useSubmitThemeForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react'

export default function ThemeHighlightedMainCategory() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedFeaturedCategories, setSelectedFeaturedCategories] = useState([]);
    const { store, setStore } = useContext(AdminContext);

    const { isLoading, handleSubmitForm } = useSubmitThemeForm();

    const handlerSubmitForm = async () => {
        const payload = {
            highlightedCategories: selectedCategories,
            selectedFeaturedCategories,
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

   


    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-semibold text-xl">首页分类(注：展示在最新上架下方)</h2>
                <p className="text-muted-foreground text-sm">配置首页展示的主要分类</p>
            </div>

            <div className="space-y-3 w-full">
                <CategoriesSelection onChange={(d) => setSelectedCategories(d)} max={2} findBy={'highlightedCategories'} hide={['mainTitle', 'isMain']}/>

                <FeaturedCategories onSelect={(d) => setSelectedFeaturedCategories(d)} findKey={'selectedFeaturedCategories'}/>
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
        </div>
    )
}
