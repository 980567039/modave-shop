"use client";

import { AdminContext } from '@/app/contexts/adminContexts';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { apiReq } from '@/lib/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';


const generalShippingSettingsFormSchema = z.object({
    flatRate: z.number(),
})

export default function ShippingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const router = useRouter();

    const { store, setStore } = useContext(AdminContext);

    const { control: shippingSettingsController, handleSubmit: shippingFormSubmit, setValue, reset, clearErrors, formState: { errors }, getValues } = useForm({
        resolver: zodResolver(generalShippingSettingsFormSchema)
    });

    const onError = (errors) => {
        setFormErrors(errors);
        console.log("errors", errors);
    };


    const onSubmitForm = async (values) => {
        try {
            setIsLoading(true);
            const payload = {
                shipping: {
                    ...values,
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

            setIsLoading(false);

            toast.success("更新成功！");

            setStore((prevState) => ({
                ...prevState,
                shipping: data.shipping,
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
        if (store && store?.shipping) {
            setValue("flatRate", store?.shipping?.flatRate);
        } else {
            // router.push('/admin')
        }
    }, [store, setValue]);
    return (
        <div className='space-y-5'>
            <div>
                <h3 className='text-xl font-semibold  m-0'>配送设置</h3>
                <p className='text-sm text-muted-foreground mt-0'>商店通用配送设置</p>
            </div>

            <div>
                <Form {...shippingSettingsController} className="space-y-3">
                    <FormField
                        control={shippingSettingsController}
                        name="flatRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>统一费率</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="统一费率"
                                        {...field}
                                        onChange={(e) => {
                                            const cleanedStr = e.target.value.replace(/[^0-9]/g, ''); // 只允许数字
                                            field.onChange(Number(cleanedStr));
                                        }}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    此配送费将作为统一配送费率应用于所有购买
                                </FormDescription>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <div className='flex justify-end'>
                        <Button type="button" onClick={shippingFormSubmit(onSubmitForm, onError)} disabled={isLoading}>
                            {isLoading ? <>
                                <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                                保存中
                            </> : <>
                                保存
                            </>}
                        </Button>
                    </div>

                </Form>
            </div>
        </div>
    )
}
