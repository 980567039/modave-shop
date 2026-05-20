"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const billingFormSchema = z.object({
    street: z.string().min(5, {
        message: "Street Address is required and must be at least 5 characters.",
    }),
    addressLine2: z.string().optional(),
    city: z.string().min(5, {
        message: "Town/City is required and must be at least 5 characters.",
    }),
    zip: z.number().min(4, {
        message: "Postal code is required and must be at least 4 characters"
    }),
    isDefault: z.boolean().optional(),
    country: z.string().optional(),
})

export default function AccountAddressForm({
    onCancel,
    data,
    onSubmit
}) {

    const [isLoading, setIsLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const { control: billingController, handleSubmit: categorySubmit, setValue, reset, clearErrors, formState: { errors }, getValues } = useForm({
        resolver: zodResolver(billingFormSchema),
        defaultValues: {
            addressLine2: '',
            country: 'Sri Lanka'
        }
    });

    const onSubmitForm = async (values) => {
        onSubmit(values)
    }

    useEffect(() => {
        if (data && data?.currentData) {
            setValue('street', data?.currentData?.street || '')
            setValue('addressLine2', data?.currentData?.addressLine2 || '')
            setValue('city', data?.currentData?.city || '')
            setValue('zip', data?.currentData?.zip || '')
            setValue('isDefault', data?.currentData?.isDefault || false)
            setIsUpdate(true)
        } else {
            setIsUpdate(false)
        }
    }, [data]);

    return (
        <div>
            <Form {...billingController}>
                <div className='flex gap-5 w-[100%] flex-grow mb-5'>
                    <FormField
                        control={billingController}
                        name="street"

                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Street address</FormLabel>
                                <FormControl>
                                    <Input
                                        className="rounded-none w-full h-[50px]"
                                        placeholder="Street address"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={billingController}
                        name="addressLine2"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Apartment, suite, unit, etc. (optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        className="rounded-none w-full h-[50px]"
                                        placeholder="Apartment, suite, unit, etc."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex gap-5 w-[100%] flex-grow mb-5'>
                    <FormField
                        control={billingController}
                        name="city"

                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input
                                        className="rounded-none w-full h-[50px]"
                                        placeholder="City"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={billingController}
                        name="zip"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                    <Input
                                        className="rounded-none w-full h-[50px]"
                                        placeholder="Postal Code / Zip Code"
                                        {...field}
                                        onChange={(e) => {
                                            const cleanedStr = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                                            field.onChange(Number(cleanedStr));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />


                </div>

                <div className='flex items-center justify-between gap-5'>
                    {data?.type === "billing" ? <FormField
                        control={billingController}
                        name="isDefault"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="is-default"
                                            checked={field.value} // Bind checked state to form field value
                                            onCheckedChange={field.onChange} // Handle change event
                                        />
                                        <Label htmlFor="is-default">Is Default</Label>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    /> : <div></div>}
                    <div className='flex items-center gap-3'>
                        <Button variant="outline" className="rounded-none" onClick={onCancel}>Cancel</Button>
                        <Button
                            onClick={categorySubmit(onSubmitForm)}
                            className="rounded-none flex gap-2 items-center justify-center"
                            disabled={isLoading}>
                            {isLoading && <LoaderCircle className='w-4 h-4 animate-spin' />}{isUpdate ? 'Update' : 'Save'} Address
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    )
}
