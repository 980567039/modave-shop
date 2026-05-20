"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

import LoginWith from '@/app/components/loginWith'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { useToast } from '@/components/ui/use-toast'
import { AlertCircle, CircleX, Loader2, ShieldCheck } from 'lucide-react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { apiReq, checkEmailAddress, isValidUsername } from '@/lib/common'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react';
import PasswordStrength from '@/app/components/passwordStrength'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Register() {
    const { toast } = useToast();
    const session = useSession();
    const router = useRouter()
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassStrength, setShowPassStrength] = useState(false);
    const [validEmail, setValidEmail] = useState(null);
    const [validUsername, setValidUsername] = useState(null);
    const [valid, setValid] = useState({
        email: null,
        username: null
    });



    const formSchema = z.object({
        email: z.string()
            .min(1, { message: "This field has to be filled." })
            .email("This is not a valid email."),
        // .refine((email) => {
        //     return checkEmailAddress(email);
        // }, "Please double-check the email address; there is something wrong."),
        username: z.string().min(3, { message: "Username cannot be empty and should be more than 3 characters." })
            .refine((username) => {
                return isValidUsername(username);
            }, "Username can only contain letters, numbers, and dashes, and should start and end with a letter or number."),
        password: z.string()
            .min(8, { message: "Password must be at least 8 characters long." })
            .refine((password) => {
                // Strong password regex: at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
                const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return strongPasswordRegex.test(password);
            }, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
        },
    });




    const isEmailAvailable = async (email) => {
        // Mocking fetchEmails function
        if (email && email.length > 0) {
            // first check the email address
            const checkEmail = checkEmailAddress(email, true);

            if (checkEmail) {
                setValidEmail(null);
                const res = await apiReq('check-email', "POST", { email });

                const data = await res?.json();

                if (data && data.message === "ok") {
                    setValid({
                        ...valid,
                        email: true,
                    });
                    setValidEmail(true);
                } else {
                    setValidEmail(false);
                    setValid({
                        ...valid,
                        email: false,
                    });
                }

            } else {
                // show email error
            }
        }
    };

    const checkUserName = async (username) => {
        // Mocking fetch usernames function
        if (username && username.length > 0 && form.formState.errors["username"] === undefined) {
            // setValid((prevState) => prevState - 1);
            const checkUsernameWith = isValidUsername(username);

            if (checkUsernameWith) {
                const res = await apiReq('check-username', "POST", { username });

                const data = await res?.json();

                if (data && data.message === "ok") {
                    setValid({
                        ...valid,
                        username: true,
                    });
                    setValidUsername(true)
                } else {
                    setValid({
                        ...valid,
                        username: false,
                    });
                    setValidUsername(false)
                }
            }
        }
    };


    const onSubmitForm = async (values) => {

        try {
            setIsLoading(true);
            const payload = {
                email: values?.email,
                username: values?.username,
                password: values?.password,
                capabilities: ['user'],
                role: "admin"
            }

            const res = await apiReq('register', "POST", payload);

            const data = await res?.json();

            if (res?.status === 200) {
                toast({
                    title: "Success!",
                    description: "Successfully registered you will re-direct to the login page",
                    position: "top-right"
                });

                router.push('/auth/login');

            } else {
                setError(data.message);
                setTimeout(() => {
                    setError('');
                }, 1000);
            }

            setIsLoading(false);
        } catch (error) {
            console.log('error', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        if (session?.status === "authenticated") {
            // redirect('/dashboard');
            // router.push('/admin')
        }
    }, [session, router])

    return (
        <div className='lg:flex lg:gap-3 lg:overflow-auto'>
            <div className='lg:w-[100%] lg:h-lvh lg:relative xl:w-[100%]'>
                <div className='lg:absolute lg:top-1/2 lg:left-1/2 lg:w-full lg:translate-y-[-50%] lg:translate-x-[-50%]  pt-[100px]'>

                    <h2 className='text-xl uppercase font-bold text-center mt-10'>Join Now</h2>
                    <p className='text-center text-gray-400 mb-5'>Create your account as below</p>


                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitForm)}>
                            <div className='flex gap-5 p-5 flex-col'>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        className="flex-1 m"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter email address"
                                                        type="email" autoComplete="off"
                                                        {...field}
                                                        onBlur={async (e) => {
                                                            field.onChange(e);
                                                            await isEmailAvailable(e.target.value)
                                                        }}
                                                        onFocus={() => {
                                                            setValid({
                                                                ...valid,
                                                                email: null,
                                                            });
                                                            setValidEmail(null);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    {validEmail !== null && <div className='pt-3 flex gap-1 items-center'>
                                        {validEmail ? <ShieldCheck className='w-4 h-4 text-green-600' /> : <CircleX className='w-4 h-4 text-red-500' />}
                                        <p className={`text-xs ${validEmail ? 'text-green-600' : 'text-red-500'}`}>{validEmail ? "Email address validated" : "Email address is already taken, please use another one"}</p>
                                    </div>}
                                </div>
                                <div>
                                    <div className='relative'>
                                        <span className='absolute top-[15px] text-sm text-gray-400 left-4 pointer-events-none'>meetme.app/</span>
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            className="flex-1 m"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="username"
                                                            type="text"
                                                            className="pl-[110px]"
                                                            autoComplete="off"
                                                            {...field}

                                                            onBlur={async (e) => {
                                                                field.onChange(e);
                                                                await checkUserName(e.target.value)
                                                            }}
                                                            onFocus={() => {
                                                                setValid({
                                                                    ...valid,
                                                                    username: null,
                                                                });
                                                                setValidUsername(null)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                    {validUsername !== null && <div className='pt-3 flex gap-1 items-center'>
                                        {validUsername ? <ShieldCheck className='w-4 h-4 text-green-600' /> : <CircleX className='w-4 h-4 text-red-500' />}
                                        <p className={`text-xs ${validUsername ? 'text-green-600' : 'text-red-500'}`}>{validUsername ? "Username validated" : "Username is already taken, please use another one"}</p>
                                    </div>}

                                </div>

                                <FormField
                                    control={form.control}
                                    name="password"
                                    className="flex-1 m"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <>
                                                    <Input placeholder="Password" type="password" onFocus={() => setShowPassStrength(true)} autoComplete="off" onBlur={() => setShowPassStrength(false)} {...field} />
                                                    {showPassStrength && <PasswordStrength password={field.value} onFocus={field} />}
                                                </>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {error !== "" && <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle className="text-xs">Error</AlertTitle>
                                    <AlertDescription className="text-xs">
                                        {error}
                                    </AlertDescription>
                                </Alert>}




                                <Button className="mb-5" type="submit" disabled={(valid?.email === false || valid.username === false) || isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    创建账户
                                </Button>

                                <p className='text-center text-xs text-muted-foreground mb-5'>By clicking Create account, you agree to  Terms and Conditions and confirm you have read our Privacy Notice. You may receive offers, news and updates from us.</p>

                                <span className='text-center'>OR</span>

                                <div className='mb-5'>
                                    <LoginWith />
                                </div>

                                <div className='flex gap-1 text-center text-muted-foreground justify-center items-center text-sm'>
                                    <p>Already have an account?</p>
                                    <Link href="/login" className='underline text-blue-500'>Log in</Link>
                                </div>
                            </div>
                        </form>
                    </Form>


                </div>
            </div>

            <div className='hidden lg:block lg:w-[40%] xl:w-[30%] bg-slate-100'>Right</div>
        </div>
    )
}
