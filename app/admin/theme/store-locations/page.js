"use client";

import StoreLocatorRepeater from '@/app/components/admin/theme/storeLocatorRepeater';
import { AdminContext } from '@/app/contexts/adminContexts';
import useSubmitThemeForm from '@/app/hooks/useSubmitThemeForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'

export default function ThemeStoreLocations() {
    const [data, setData] = useState({});
    const { isLoading, handleSubmitForm } = useSubmitThemeForm();
    const { store, setStore } = useContext(AdminContext);

    const handlerSubmitForm = async () => {
        const payload = {
            storeLocations: data,
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

    useEffect(() => {
        if (store && store?.theme && store?.theme?.storeLocations) {
            setData({ ...store?.theme?.storeLocations });
        }
    }, [store]);

    return (
        <div className="space-y-5 mb-5">
            <div>
                <h2 className="font-semibold text-xl">店铺位置</h2>
                <p className="text-muted-foreground text-sm">填写店铺位置信息</p>
            </div>
            {/* <div className="flex items-start gap-3">

                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">区域标题</label>
                    <Input
                        type="text"
                        placeholder="区域标题"
                        value={data?.sectionTitle}
                        onChange={(e) => setData((prevState) => ({
                            ...prevState,
                            sectionTitle: e.target?.value,
                        }))}
                    />
                </div>
                <div className="space-y-3 w-full">
                    <label className="text-sm font-semibold">标题标语</label>
                    <Input
                        type="text"
                        placeholder="标语"
                        value={data?.tagline}
                        onChange={(e) => setData((prevState) => ({
                            ...prevState,
                            tagline: e.target?.value,
                        }))}
                    />
                </div>
            </div> */}

            <div className="space-y-3 w-full">
                <label className="text-sm font-semibold">添加店铺位置</label>
                <StoreLocatorRepeater onChange={(d) => setData((prevData) => ({
                    ...prevData,
                    locations: d
                }))} />
            </div>


            <div className="flex justify-end ">
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
