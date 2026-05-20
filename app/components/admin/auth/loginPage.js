"use client";
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';



export default function LoginPage() {
    const session = useSession();
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const renderMessage = (er) => {
        switch (er) {
            case "CredentialsSignin":
                return "Email address or password dose not match"
            default:
                return er;
        }
    }


    const formSchema = z.object({
        email: z.string()
            .min(1, { message: "This field has to be filled." }),
        password: z.string()
            .min(8, { message: "Password must be at least 8 characters long." })
            .refine((password) => {
                const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return strongPasswordRegex.test(password);
            }, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmitForm = async (values) => {

        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                callbackUrl: '/admin',
                email: values.email,
                password: values.password
            });

            

            if (res?.ok) {
                toast.success("Login Successfully!");
                router.push(res.url || '/admin');
            } else {
                const message = res.error;
                setError(renderMessage(message));
            }
            setIsLoading(false);
        } catch (error) {
            console.log('error ===', error);
            setIsLoading(false);
        }
    }


    useEffect(() => {
        if (session.status === "loading") return;  // Ensure session is fully loaded
        if (session.status === "authenticated") {
            router.push('/admin');
        }
    }, [session, router]);

    return (
        <Form {...form}>
            <div className={cn("flex flex-col gap-6")}>
                <Card className="overflow-hidden border-none shadow-lg">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmitForm)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center space-y-10">
                                    <img src="https://res.cloudinary.com/dk38h0mqm/image/upload/v1762603677/uploads/1e1e5a208960606c150ee5182b61286d.png" alt="nuvie main logo" width={150} height={80} />
                                    <div>
                                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                                        <p className="text-balance text-muted-foreground">
                                            Login to your Nuvie Account
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        className="flex-1 m"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter email address"
                                                        type="text" autoComplete="off"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        className="flex-1 m"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Password" type="password" autoComplete="off"  {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {error !== "" && <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle className="text-xs">Error</AlertTitle>
                                    <AlertDescription className="text-xs">
                                        {error}
                                    </AlertDescription>
                                </Alert>}

                                <Button className="mb-5" type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Log in
                                </Button>

                                <div className='p-5'>
                                    <Link href="/" className='flex gap-1 items-center text-sm'><ArrowLeft className='w-4 h-4 text-muted-foreground' />Back to site</Link>
                                </div>


                            </div>
                        </form>
                        <div className="relative hidden bg-muted md:block">
                            <Image
                                src="https://uptownsrilanka.com/uploads/76e3c37b0579504b8d6fb8dd1f589093.webp"
                                alt="Image"
                                width={300}
                                height={400}
                                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            />
                        </div>
                    </CardContent>
                </Card>
                
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                    By clicking continue, you agree to our <Link href="/help/terms-of-service" target='_blank'>Terms of Service</Link>{" "}
                    and <Link href="/help/privacy-policy"  target='_blank'>Privacy Policy</Link>.
                </div>
            </div>


            {/* <form onSubmit={form.handleSubmit(onSubmitForm)}>

                <div className='flex gap-5 p-5 flex-col'>
                    <FormField
                        control={form.control}
                        name="email"
                        className="flex-1 m"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Enter email address"
                                        type="text" autoComplete="off"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="password"
                        className="flex-1 m"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Password" type="password" autoComplete="off"  {...field} />
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

                    <Button className="mb-5" type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Log in
                    </Button>

                </div>
            </form> */}
        </Form>
    )
}
