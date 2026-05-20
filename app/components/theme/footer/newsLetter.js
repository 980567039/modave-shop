"use client";


import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { apiReq } from '@/lib/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, CheckCheck, Loader2 } from 'lucide-react';
import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';


const newsLetterFormSchema = z.object({
    email: z.string().email().min(5),
});


export default function NewsLetter() {
    const [isLoading, setIsLoading] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const { control: newsLetterController, handleSubmit: generalSubmit } = useForm({
        resolver: zodResolver(newsLetterFormSchema),
        defaultValues: {
            email: "",
        }
    });

    const onError = (errors) => {
        setFormErrors(errors);
        console.log("errors", errors);
    };

    const onSubmitForm = async (values) => {
        try {
            setIsLoading(true);
            "use server"
            const res = await apiReq('/site/account/user', 'POST', values);
            if(!res.ok){
                toast.error('Error', {
                    description: 'Please try again later'
                })

                setIsLoading(false);
            }

            
            setIsLoading(false);
            setOpenConfirm(true);
            removeAlert();
        } catch (error) {
            setIsLoading(false);
        }
    }

    const removeAlert = () => {
        setTimeout(() => {
            setOpenConfirm(false);
        }, 5000)
    }


    return (
        <div className="relative">
            <Form {...newsLetterController} >
                <div className="relative z-0">
                    <FormField
                        control={newsLetterController}
                        name="email"

                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <input
                                        className='w-full border-0 rounded-full h-[50px] pr-[50px] lg:h-[80px] px-5 lg:text-center text-[16px] outline-0 text-black lg:text-sm'
                                        placeholder="Enter Your Email Here"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-600" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className={`absolute top-[5px] lg:top-2 right-[5px] lg:right-2 z-30 ${isLoading ? 'w-full' : ''}`}>
                    <button
                        className={`border-0 bg-black h-[40px] w-[40px] lg:h-[65px] ${isLoading ? 'lg:w-[90%]' : 'lg:w-[65px]'} flex items-center justify-center rounded-full`}
                        type='submit'
                        onClick={generalSubmit(onSubmitForm, onError)}
                        disabled={isLoading}>
                        {isLoading ? <Loader2 size={20} strokeWidth={1} className='animate-spin' /> : <ArrowRight size={20} strokeWidth={1} />}
                    </button>
                </div>
            </Form>

            <AlertDialog open={openConfirm} onOpenChange={() => setOpenConfirm(false)}>
                <AlertDialogContent style={{
                    borderRadius: 30
                }}>
                    <AlertDialogHeader>
                        <AlertDialogTitle></AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3 text-center">
                            <div className='w-[100px] h-[100px] rounded-full bg-black flex items-center mx-auto justify-center mb-3'>
                                <Check size={50} strokeWidth={1} className='mx-auto text-white'/>
                            </div>
                            <h3 className='font-headingFontExtraBold uppercase text-xl text-black mt-3 block'>You have successfully subscribed!</h3>
                            <p>We will update you on all our latest products and exclusive offers via email. Thank you for subscribing!</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}
