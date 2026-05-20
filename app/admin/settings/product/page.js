"use client";


import { AdminContext } from '@/app/contexts/adminContexts';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { apiReq } from '@/lib/common';
import { Loader2 } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';


export default function SettingProductPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [enabledProductFreeShippingTag, setEnabledProductFreeShippingTag] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const { store, setStore } = useContext(AdminContext);


    const onSubmitForm = async () => {
        try {
            setIsLoading(true);
            const payload = {
                productsSettings: {
                    enabledProductFreeShippingTag,
                }
            }

            let res;

            if (store?._id) {
                const updateId = {
                    ...payload,
                    id: store?._id,
                }


                res = await apiReq('admin/store', 'PUT', updateId);
            } else {
                res = await apiReq('admin/store', 'POST', payload);
            }

            const { data } = await res.json();

            console.log("store---", data);
            // return false

            setIsLoading(false);
            toast.success("更新成功！");

            setStore((prevState) => ({
                ...prevState,
                productsSettings: data.productsSettings,
            }));
        } catch (error) {
            console.log(error);
            toast.error("出错了！", {
                description: '请稍后再试。'
            });
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        
        if(store && Object.keys(store).length !== 0){
            setEnabledProductFreeShippingTag(store?.productsSettings?.enabledProductFreeShippingTag)
        }
    }, [store])
    return (
        <div className='space-y-5'>
            <div>
                <h3 className='text-xl font-semibold m-0'>产品设置</h3>
                <p className='text-sm text-muted-foreground mt-0'>商店产品设置</p>
            </div>

            <div>
                <div className="flex items-center space-x-2 mb-5">
                    <Switch
                        id="enabledProductFreeShippingTag"
                        checked={enabledProductFreeShippingTag}
                        onCheckedChange={() => setEnabledProductFreeShippingTag((prevState) => !prevState)}
                    />
                    <Label htmlFor="enabledProductFreeShippingTag">在产品卡片上启用免费配送标签</Label>
                </div>

                <Button onClick={onSubmitForm} disabled={isLoading}>{isLoading && <Loader2 className='animate-spin' />} 保存</Button>
            </div>
        </div>
    )
}
