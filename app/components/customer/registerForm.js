import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { apiReq, checkEmailAddress } from '@/lib/common';
import { AlertCircle, CircleX, Loader2, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import PasswordStrength from '../passwordStrength';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function RegisterForm({
    form, onSubmitForm, loading, activeRole
}) {
    const [validEmail, setValidEmail] = useState(null);
    const [isLoading, setIsLoading] = useState(loading || false);
    const [error, setError] = useState('');
    const [showPassStrength, setShowPassStrength] = useState(false);
    const [valid, setValid] = useState({
        email: null,
        username: null
    });
    const userMap = {
        'admin': '管理员',
        'manager': '经理',
        'sales': '销售人员',
        'marketing': '市场营销',
        'inventoryManager': '库存管理员',
      };

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

    useEffect(() => {
        setIsLoading(loading);
    }, [loading]);

    return (
        <div className='mt-5'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitForm)}>
                    <div className='flex gap-5 flex-col'>
                        <div>
                            <FormField
                                control={form.control}
                                name="email"
                                className="flex-1 m"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="输入电子邮件地址"
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

                        <FormField
                            control={form.control}
                            name="password"
                            className="flex-1 m"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <>
                                            <Input placeholder="输入密码" type="password" onFocus={() => setShowPassStrength(true)} autoComplete="off" onBlur={() => setShowPassStrength(false)} {...field} />
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
                            创建 {userMap[activeRole]} 账户
                        </Button>

                    </div>
                </form>
            </Form>
        </div>
    )
}
