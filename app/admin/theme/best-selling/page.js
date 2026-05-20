"use client";

import SearchAndAddProduct from '@/app/components/admin/theme/searchAndAddProduct';
import { AdminContext } from '@/app/contexts/adminContexts';
import useSubmitThemeForm from '@/app/hooks/useSubmitThemeForm';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { apiReq } from '@/lib/common';
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner';

export default function ThemeBestSelling() {
    const { isLoading, handleSubmitForm } = useSubmitThemeForm();

    const [sectionTitle, setSectionTitle] = useState('');
    const [tagline, setTagline] = useState('');
    const [viewMoreUrl, setViewMoreUrl] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [linkText, setLinkText] = useState('');

    const [isLoadingProducts, setIsLoadingProducts] = useState(false);


    const { store, setStore } = useContext(AdminContext);

    const getProductData = async (ids) => {
        try {
            setIsLoadingProducts(true);
            const res = await apiReq('admin/product/get-by-ids', 'POST', { ids });
            const { data } = await res.json();

            if (!res.ok) {
                toast.error("获取产品时出错")
            }

            setStore((prevState) => ({
                ...prevState,
                theme: {
                    ...store?.theme,
                    bestSelling: {
                        ...store?.theme?.bestSelling,
                        selectedProducts: data,
                    }
                },
            }));

            setSelectedProducts(data || []);
            setIsLoadingProducts(false);
        } catch (error) {
            setIsLoadingProducts(false)
        } finally {
            setIsLoadingProducts(false)
        }


    }

    const handlerSubmitForm = () => {
        console.log("提交");
        const payload = {
            bestSelling: {
                sectionTitle,
                tagline,
                viewMoreUrl,
                selectedProducts: selectedProducts?.map((d) => d._id),
                linkText
            },
            storeId: store?._id,
        };

        handleSubmitForm(
            'admin/store/theme', // 动态URL
            'POST', // HTTP方法
            payload, // 动态载荷
            (data) => {
                const isArrayOfStrings = data?.bestSelling?.selectedProducts?.every(item => typeof item === 'string');

                if (data && isArrayOfStrings) {
                    getProductData(data?.bestSelling?.selectedProducts);
                } else {
                    setStore((prevState) => ({
                        ...prevState,
                        theme: data,
                    }));

                }
            }
        );

    }


    useEffect(() => {
        if (store && store?.theme && store?.theme?.bestSelling) {
            const { sectionTitle, viewMoreUrl, linkText, tagline, selectedProducts } = store?.theme?.bestSelling;
            const isArrayOfStrings = selectedProducts?.every(item => typeof item === 'string');

            setSectionTitle(sectionTitle);
            setLinkText(linkText)
            setViewMoreUrl(viewMoreUrl)
            setTagline(tagline);

            if (isArrayOfStrings) {
                getProductData(selectedProducts)
            } else {
                setSelectedProducts(selectedProducts)
            }
        }
    }, [store]);

    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-semibold text-xl">畅销产品</h2>
                <p className="text-muted-foreground text-sm">整理所有最畅销的产品，以便在首页上突出显示。</p>
            </div>

            <div className="flex items-start gap-3">

                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">区块标题</label>
                    <Input
                        type="text"
                        placeholder="区块标题"
                        value={sectionTitle}
                        onChange={(e) => setSectionTitle(e.target.value)}
                    />
                </div>
                {/* <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">标题标语</label>
                    <Input
                        type="text"
                        placeholder="标语"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                    />
                </div> */}
            </div>
            {/* <div className="flex items-start gap-3">
                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">查看更多链接</label>
                    <Input
                        type="text"
                        placeholder="URL"
                        value={viewMoreUrl}
                        onChange={(e) => setViewMoreUrl(e.target.value)}
                    />
                </div>
                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">链接文本</label>
                    <Input
                        type="text"
                        placeholder="链接文本"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                    />
                </div>
            </div> */}


            <div className="p-5 bg-slate-50 rounded-md space-y-3">
                <label className="text-sm font-semibold">添加畅销产品</label>

                {isLoadingProducts ? <div className="grid grid-cols-4 gap-4">
                    <AspectRatio ratio={1 / 1}><Skeleton className="w-full h-full" /></AspectRatio>
                    <AspectRatio ratio={1 / 1}><Skeleton className="w-full h-full" /></AspectRatio>
                    <AspectRatio ratio={1 / 1}><Skeleton className="w-full h-full" /></AspectRatio>
                    <AspectRatio ratio={1 / 1}><Skeleton className="w-full h-full" /></AspectRatio>
                </div> : (<SearchAndAddProduct onSelect={(d) => setSelectedProducts(d)} findKey={'bestSelling'} />)}



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
