import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Contact, Locate, Map } from 'lucide-react';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'

const shippingFormSchema = z.object({
    firstName: z.string().min(2, {
        message: "First Name must be at least 2 characters.",
    }),
    lastName: z.string().optional(),
    streetAddress: z.string().min(2, {
        message: "Street address must be at least 2 characters.",
    }),
    addressLine2: z.string().optional(),
    townCity: z.string().min(2, {
        message: "Town / City must be at least 2 characters.",
    }),
    postalCode: z.number().min(2, {
        message: "Postal Code must be at least 2 characters.",
    }),
    email: z.string().email().min(5, {
        message: "Email address must be at least 5 characters.",
    }),
    phone: z.number().min(10, {
        message: "Phone number must be 10 characters",
    }),
})

export default function ShippingAddress({
    onClose,
    onSubmitData,
    data
}) {
    const { control: shippingController, handleSubmit: shippingSubmit, setValue, reset, clearErrors, formState: { errors } } = useForm({
        resolver: zodResolver(shippingFormSchema),
        defaultValues: {
            firstName: "",
        },
    });

    const onSubmit = async (values) => {
        onSubmitData(values);
    }

    useEffect(() => {
        if (data && Object.keys(data).length !== 0) {
            setValue("firstName", data?.firstName || '');
            setValue("lastName", data?.lastName || '');
            setValue("streetAddress", data?.streetAddress || '');
            setValue("addressLine2", data?.addressLine2 || '');
            setValue("townCity", data?.townCity || '');
            setValue("postalCode", Number(data?.postalCode) || '');
            setValue("email", data?.email || '');
            setValue("phone", Number(data?.phone) || '');
        }
    }, [data]);

    return (
        <Form {...shippingController}>
            <div className='flex gap-5 w-[100%] flex-grow mb-2'>
                <FormField
                    control={shippingController}
                    name="firstName"

                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs font-semibold">First Name</FormLabel>
                            <FormControl>
                                <Input
                                    className="rounded-3xl w-full"
                                    placeholder="Jhon"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={shippingController}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs font-semibold">Last Name</FormLabel>
                            <FormControl>
                                <Input
                                    className="rounded-3xl w-full"
                                    placeholder="Doe"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
            </div>

            <div className='flex gap-2 items-center'>
                <h2 className='text-lg font-semibold font-headingFontMedium uppercase tracking-wider'>Address</h2>
            </div>
            <div className='flex gap-5 w-[100%] flex-grow mb-2'>
                <FormField
                    control={shippingController}
                    name="streetAddress"

                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs font-semibold">Street address</FormLabel>
                            <FormControl>
                                <Input
                                    className="rounded-3xl w-full"
                                    placeholder="Street address"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={shippingController}
                    name="addressLine2"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs font-semibold">Apartment, suite, unit, etc. (optional)</FormLabel>
                            <FormControl>
                                <Input
                                    className="rounded-3xl w-full"
                                    placeholder="Apartment, suite, unit, etc."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
            </div>
            <div className='flex gap-5 w-[100%] flex-grow mb-2'>
                <FormField
                    control={shippingController}
                    name="townCity"

                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs font-semibold">Town City</FormLabel>
                            <FormControl>
                                <Input
                                    className="rounded-3xl w-full"
                                    placeholder="Town / City"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={shippingController}
                    name="postalCode"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs font-semibold">Postal Code</FormLabel>
                            <FormControl>
                                <Input
                                    className="rounded-3xl w-full"
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

            <div className='flex gap-2 items-center'>
                <h2 className='text-lg font-semibold font-headingFontMedium uppercase tracking-wider'>Contact Information</h2>
            </div>

            <div className='flex gap-5 w-[100%] flex-grow mb-2'>
                <FormField
                    control={shippingController}
                    name="email"

                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs font-semibold">Email address</FormLabel>
                            <FormControl>
                                <Input
                                    className="rounded-3xl w-full"
                                    placeholder="Email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={shippingController}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs font-semibold">Phone</FormLabel>
                            <FormControl>
                                <Input
                                    className="rounded-3xl w-full"
                                    placeholder="Phone"
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

            <div className='flex items-center justify-end gap-3'>
                <Button className="rounded-full" onClick={onClose} variant="outline">Cancel</Button>
                <Button className="rounded-full" onClick={shippingSubmit(onSubmit)}>Submit</Button>
            </div>
        </Form>
    )
}
