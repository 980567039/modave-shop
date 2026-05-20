"use client";

import SiteMainSliderSection from "@/app/components/admin/theme/header/mainSliderSection";
import SiteMovingText from "@/app/components/admin/theme/header/movingText";
import SearchAndAddProduct from "@/app/components/admin/theme/searchAndAddProduct";
import { AdminContext } from "@/app/contexts/adminContexts";
import useSubmitThemeForm from "@/app/hooks/useSubmitThemeForm";
import { Button } from "@/components/ui/button";
import { apiReq } from "@/lib/common";
import { LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner";


export default function ThemeHeaderPage() {
    const [slider, setSlider] = useState([]);
    const [movingText, setMovingText] = useState({});
    const [selectedProducts, setSelectedProducts] = useState([]);

    const { store, setStore } = useContext(AdminContext);
    const { isLoading, handleSubmitForm } = useSubmitThemeForm();

    const handlerOnChangeSlider = (d) => {
        setSlider(d)
    }

    const handlerSubmitForm = async () => {
        // return false;
        const payload = {
            header: {
                slider,
                movingText,
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
                    theme: data,
                }));
            }
        );
    }



    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-semibold text-xl">页头主体</h2>
                <p className="text-muted-foreground text-sm">网站的所有页头自定义将在此集中管理。</p>
            </div>

            <div className="space-y-3 w-full">
                <div className="w-full border-b-[1px] pt-5 flex flex-col gap-3">
                    <label className="text-sm font-semibold">主轮播项目</label>
                    <SiteMainSliderSection onChange={handlerOnChangeSlider} />
                </div>

                {/* <div className="w-full pt-5 flex flex-col gap-3">
                    <label className="text-sm font-semibold">滚动文字</label>
                    <SiteMovingText onChange={(d) => setMovingText(d)}/>
                </div> */}

                <div className="w-full pt-5 flex flex-col gap-3">
                    <label className="text-sm font-semibold">精选产品卡片(注：展示在轮播图内部)</label>
                    <p className="text-muted-foreground text-sm">这些选定的四张图片将被随机展示。</p>
                    <SearchAndAddProduct onSelect={(d) => setSelectedProducts(d)} isAutoFetch={false} max={4} findKey={'header'} />
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
        </div>
    )
}
