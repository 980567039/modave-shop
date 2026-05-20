"use client";

import { AdminContext } from '@/app/contexts/adminContexts';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { apiReq } from '@/lib/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const generalSettingsFormSchema = z.object({
    storeTitle: z.string().min(2, {
        message: "商店标题必须至少包含2个字符。",
    }),
    description: z.string().optional(),
    disabledPlaceOder: z.boolean(),
    enabledSnow: z.boolean().optional(),
    snowSpeed: z.number().optional(),
})

export default function Settings() {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const router = useRouter();

    const { store, setStore } = useContext(AdminContext);

    const { control: generalSettingsController, handleSubmit: generalSubmit, setValue, watch, reset, clearErrors, formState: { errors }, getValues } = useForm({
        resolver: zodResolver(generalSettingsFormSchema),
        defaultValues: {
            storeTitle: "",
            titleSlug: "",
            description: "",
            disabledPlaceOder: false,
            enabledSnow: false,
            snowSpeed: 150
        }
    });

    // 监视 enabledSnow 值以有条件地渲染 snowSpeed
    const enabledSnow = watch("enabledSnow");

    const onError = (errors) => {
        setFormErrors(errors);
        console.log("errors", errors);
    };

    const onSubmitForm = async (values) => {
        try {
            setIsLoading(true);
            const payload = {
                general: {
                    ...values,
                }
            }

            let res;

            if (store?.general) {
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
                general: data.general,
            }));
        } catch (error) {
            console.log(error);
            toast.error("出现错误！", {
                description: '请稍后再试。'
            });

            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (store && store?.general) {
            setValue("storeTitle", store?.general?.storeTitle);
            setValue("disabledPlaceOder", store?.general?.disabledPlaceOder);
            setValue("enabledSnow", store?.general?.enabledSnow);
            setValue("snowSpeed", store?.general?.snowSpeed);
        } else {
            router.push('/admin')
        }
    }, [store, setValue]);

    return (
        <div className='space-y-5'>
            <div>
                <h3 className='text-xl font-semibold m-0'>通用设置</h3>
                <p className='text-sm text-muted-foreground mt-0'>商店通用设置</p>
            </div>

            <div>
                <Form {...generalSettingsController}>
                    <div className="space-y-3 flex flex-col gap-3">
                        <FormField
                            control={generalSettingsController}
                            name="storeTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>商店标题</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="商店标题"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        这是您的商店标题，仅在管理面板中显示
                                    </FormDescription>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={generalSettingsController}
                            name="disabledPlaceOder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center space-x-2 mb-5">
                                            <Switch
                                                id="disabledPlaceOder"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <Label htmlFor="disabledPlaceOder">禁用下单按钮</Label>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <div className='mb-5 block'>
                            <FormField
                                control={generalSettingsController}
                                name="enabledSnow"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2 mb-5">
                                                <Switch
                                                    id="enabledSnow"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <Label htmlFor="enabledSnow">启用雪花效果</Label>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            {/* 仅在 enabledSnow 为 true 时显示 snowSpeed 滑块 */}
                            {enabledSnow && (
                                <FormField
                                    control={generalSettingsController}
                                    name="snowSpeed"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Slider defaultValue={field.value} value={[field.value]} onValueChange={(value) => field.onChange(value[0])} max={1300} step={1} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </div>

                    <div className='flex justify-end mt-3'>
                        <Button type="button" onClick={generalSubmit(onSubmitForm, onError)} disabled={isLoading}>
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