"use client";

import SearchAndAddProduct from "@/app/components/admin/theme/searchAndAddProduct";
import { AdminContext } from "@/app/contexts/adminContexts";
import useSubmitThemeForm from "@/app/hooks/useSubmitThemeForm";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { apiReq, transformS3UrlsInObject } from "@/lib/common";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ThemeLatestArrivalPage() {
    const [sectionTitle, setSectionTitle] = useState('');
    const [viewMoreUrl, setViewMoreUrl] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [linkText, setLinkText] = useState('');
    const [isAutoFetch, setIsAutoFetch] = useState(true);

    const [isLoadingFetch, setIsLoadingFetch] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const { store, setStore } = useContext(AdminContext);

    const { isLoading, handleSubmitForm } = useSubmitThemeForm();

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
                    latestArrival: {
                        ...store?.theme?.latestArrival,
                        selectedProducts: transformS3UrlsInObject(data),
                        isAutoFetch,
                    }
                },
            }));

            setSelectedProducts(data || []);
            setIsLoadingProducts(false);
            setIsAutoFetch(store?.theme?.latestArrival?.isAutoFetch);
        } catch (error) {
            setIsLoadingProducts(false)
        } finally {
            setIsLoadingProducts(false)
        }


    }


    const handlerSubmitForm = async () => {
        // submit form
        const payload = {
            latestArrival: {
                sectionTitle,
                viewMoreUrl,
                selectedProducts: selectedProducts?.map((d) => d._id),
                linkText,
                isAutoFetch
            },
            storeId: store?._id,
        };


        handleSubmitForm(
            'admin/store/theme', // 动态URL
            'POST', // HTTP方法
            payload, // 动态载荷
            (data) => {
                const isArrayOfStrings = data?.latestArrival?.selectedProducts?.every(item => typeof item === 'string');
                if (isArrayOfStrings) {
                    getProductData(data?.latestArrival?.selectedProducts);
                } else {
                    setStore((prevState) => ({
                        ...prevState,
                        theme: data,
                    }));

                }
            }
        );
    }

    const handlerGetLatest = async () => {
        // get latest
        try {
            setIsLoadingFetch(true);
            const res = await apiReq('admin/product?delete=false&limit=4&type=all', 'GET');
            const { data } = await res.json();

            if (!res.ok) {
                toast.error("出现错误！", {
                    description: "请稍后再试"
                })
            }
            if (data) {
                
                setSelectedProducts(transformS3UrlsInObject(data?.products));
            }


        } catch (error) {
            console.log(error);

            setIsLoadingFetch(false);
        } finally {
            setIsLoadingFetch(false);
        }
    }

    useEffect(() => {
        setSelectedProducts(isAutoFetch && selectedProducts?.length > 0 ? selectedProducts : [])
    }, [isAutoFetch]);


    useEffect(() => {
        if (store && store?.theme && store?.theme?.latestArrival) {

            const { sectionTitle, viewMoreUrl, linkText, isAutoFetch, selectedProducts } = store?.theme?.latestArrival;



            setSectionTitle(sectionTitle);
            setLinkText(linkText)
            setViewMoreUrl(viewMoreUrl)
            setIsAutoFetch(isAutoFetch);

            if (store?.theme?.latestArrival?.selectedProducts) {
                const isArrayOfStrings = store?.theme?.latestArrival?.selectedProducts?.every(item => typeof item === 'string') || false;
                
                if (isArrayOfStrings) {
                    getProductData(store?.theme?.latestArrival?.selectedProducts)
                } else {
                    setSelectedProducts(store?.theme?.latestArrival?.selectedProducts)
                }
            }

        }
    }, [store]);


    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-semibold text-xl">最新上架区域(注：展示在首页轮播图下方)</h2>
                <p className="text-muted-foreground text-sm">配置首页展示的最新上架产品</p>
            </div>

            <div className="space-y-3 w-full">
                <label className="text-sm font-semibold">区域标题</label>
                <Input
                    type="text"
                    placeholder="区域标题"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                />
            </div>
            <div className="flex items-start gap-3">
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
            </div>
            {isLoadingProducts ? <>
                <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
            </> : <>
                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">产品</label>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is-auto-fetch"
                            checked={isAutoFetch}
                            onCheckedChange={() => setIsAutoFetch((prevState) => !prevState)} />
                        <Label htmlFor="is-auto-fetch">获取最新产品</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">- 切换此开关以显示最近添加的四个产品。</p>
                    <p className="text-xs text-muted-foreground">- 关闭此开关以手动选择和显示产品。</p>
                </div>
                {!isAutoFetch ?
                    <div className="p-5 bg-slate-50 rounded-md ">
                        {isLoadingProducts ? <>
                            <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                        </> : <div className="space-y-3">
                            <label className="text-sm font-semibold">添加自定义产品</label>

                            <SearchAndAddProduct onSelect={(d) => setSelectedProducts(d)} isAutoFetch={isAutoFetch} max={4} findKey={'latestArrival'} />
                        </div>}

                    </div> :
                    <div>
                        <Button onClick={handlerGetLatest}>
                            {isLoadingFetch ? <>
                                <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                                正在获取最新产品
                            </> : <>
                                获取最新产品
                            </>}
                        </Button>

                        <div className="grid grid-cols-4 gap-4">
                            {isLoadingProducts && <>
                                <AspectRatio ratio={1 / 1}><Skeleton className="w-full h-full" /></AspectRatio>
                                <AspectRatio ratio={1 / 1}><Skeleton className="w-full h-full" /></AspectRatio>
                                <AspectRatio ratio={1 / 1}><Skeleton className="w-full h-full" /></AspectRatio>
                                <AspectRatio ratio={1 / 1}><Skeleton className="w-full h-full" /></AspectRatio>
                            </>}

                            {selectedProducts && selectedProducts?.length > 0 && selectedProducts?.map((product, i) => (
                                <div key={i} className="relative bg-white p-1">
                                    <AspectRatio ratio={8 / 12} className="relative overflow-hidden">
                                        <img src={product?.defaultImage && product?.defaultImage?.url ? product?.defaultImage?.url : "https://dummyimage.com/400x400/ddd/000"} width={400} height={500} alt="" className="w-full h-full absolute left-0 top-0 object-cover" />
                                    </AspectRatio>
                                    <div className="pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm">{product?.title}</span>
                                            {product?.sku && product?.sku !== "" && <span className="text-xs text-muted-foreground">SKU: {product?.sku}</span>}
                                            <span className={`text-xs  ${product?.inStock ? 'text-green-600' : 'text-red-600'}`}>{product?.inStock ? '有库存' : '缺货'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>}
            </>}
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