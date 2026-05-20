"use client";

import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from '@/components/ui/switch';
import { cn } from "@/lib/utils";
import { apiReq } from '@/lib/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from "date-fns";
import { Calendar as CalendarIcon, LoaderCircle } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AdminContext } from '@/app/contexts/adminContexts';

const generalOffersSettingsFormSchema = z.object({
    parentage: z.number(),
    enabledOffer: z.boolean(),
    offersText: z.string(),
    
    enabledKokoOffer: z.boolean(),
    kokoParentage: z.number(),
    kokoOffersText: z.string(),
    // fromDate: z.date().optional(),
    // toDate: z.date().optional(),
});

export default function OffersPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const router = useRouter();
    const { store, setStore } = useContext(AdminContext);

    const form = useForm({
        resolver: zodResolver(generalOffersSettingsFormSchema),
        defaultValues: {
            parentage: 0,
            enabledOffer: false,
            offersText: "",
            enabledKokoOffer: false,
            kokoParentage: 0,
            kokoOffersText: "",
            // fromDate: undefined,
            // toDate: undefined,
        }
    });

    const onError = (errors) => {
        setFormErrors(errors);
        console.log("errors", errors);
    };

    const onSubmitForm = async (values) => {
        try {
            setIsLoading(true);
            const payload = {
                offers: {
                    ...values,
                    kokoOfferDate: {
                        from: values.fromDate ? moment.utc(values.fromDate) : null,
                        to: values.toDate ? moment.utc(values.toDate) : null
                    }
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
                offers: data.offers,
            }));
        } catch (error) {
            console.log(error);
            toast.error("出现错误！", {
                description: '请稍后再试。'
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (store && store?.offers) {
            form.setValue("parentage", store?.offers?.parentage);
            form.setValue("enabledOffer", store?.offers?.enabledOffer);
            form.setValue("offersText", store?.offers?.offersText);
            form.setValue("enabledKokoOffer", store?.offers?.enabledKokoOffer);
            form.setValue("kokoParentage", store?.offers?.kokoParentage);
            form.setValue("kokoOffersText", store?.offers?.kokoOffersText);
            
            // if (store?.offers?.kokoOfferDate?.from) {
            //     form.setValue("fromDate", moment.utc(store?.offers?.kokoOfferDate?.from));
            // }
            // if (store?.offers?.kokoOfferDate?.to) {
            //     form.setValue("toDate", moment.utc(store?.offers?.kokoOfferDate?.to));
            // }
        }
    }, [store, form.setValue]);

    return (
        <div className='space-y-5'>
            <div>
                <h3 className='text-xl font-semibold m-0'>优惠设置</h3>
                <p className='text-sm text-muted-foreground mt-0'>商店通用优惠设置</p>
            </div>

            <div className='space-y-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm, onError)} className="space-y-3 flex flex-col gap-5">
                        <FormField
                            control={form.control}
                            name="enabledOffer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center space-x-2 mb-5">
                                            <Switch
                                                id="enabledOffer"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <Label htmlFor="enabledOffer">启用全站优惠</Label>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>优惠百分比</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="优惠百分比"
                                            {...field}
                                            onChange={(e) => {
                                                const cleanedStr = e.target.value.replace(/[^0-9]/g, '');
                                                if (cleanedStr < 100) {
                                                    field.onChange(Number(cleanedStr));
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        这些优惠将适用于除礼品卡外的所有购买。
                                    </FormDescription>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="offersText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>优惠文本</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="显示文本"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        此标题将显示在结账页面
                                    </FormDescription>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <div className='my-5 space-y-4'>
                            <h3 className='font-semibold mb-3'>KOKO 优惠</h3>
                            <FormField
                                control={form.control}
                                name="enabledKokoOffer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2 mb-5">
                                                <Switch
                                                    id="enabledKokoOffer"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <Label htmlFor="enabledKokoOffer">启用 KOKO 优惠</Label>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="kokoParentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>优惠百分比</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="优惠百分比"
                                                {...field}
                                                onChange={(e) => {
                                                    const cleanedStr = e.target.value.replace(/[^0-9]/g, '');
                                                    if (cleanedStr < 100) {
                                                        field.onChange(Number(cleanedStr));
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            这些优惠将适用于使用 KOKO 支付的所有购买。
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="kokoOffersText"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>优惠文本</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="显示文本"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            此标题将显示在结账页面
                                        </FormDescription>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* <div className="space-y-3">
                                <FormLabel>优惠有效期</FormLabel>
                                <div className="flex flex-col gap-2">
                                    <FormField
                                        control={form.control}
                                        name="fromDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>开始日期</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date()
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="toDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>结束日期</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date() || (form.watch("fromDate") && date < form.watch("fromDate"))
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div> */}
                        </div>

                        <div className='flex justify-end'>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                                        保存中
                                    </>
                                ) : (
                                    <>保存</>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}