import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import RegisterForm from './registerForm';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { apiReq } from '@/lib/common';

// Add role capabilities configuration
const ROLE_CAPABILITIES = {
    admin: [
        { id: 'dashboard', label: '仪表盘' },
        { id: 'analytics', label: '分析' },
        { id: 'orders', label: '订单' },
        { id: 'products', label: '产品' },
        { id: 'attributes', label: '属性' },
        { id: 'categories', label: '分类' },
        { id: 'theme', label: '主题' },
        { id: 'settings', label: '设置' },
    ],
    manager: [
        { id: 'dashboard', label: '仪表盘' },
        { id: 'analytics', label: '分析' },
        { id: 'products', label: '产品' },
        { id: 'orders', label: '订单' },
        { id: 'attributes', label: '属性' },
        { id: 'categories', label: '分类' }
    ],
    sales: [
        { id: 'dashboard', label: '仪表盘' },
        { id: 'analytics', label: '分析' },
        { id: 'products', label: '产品' },
        { id: 'orders', label: '订单' },
        { id: 'attributes', label: '属性' },
        { id: 'categories', label: '分类' }
    ],
    marketing: [
        { id: 'dashboard', label: '仪表盘' },
        { id: 'analytics', label: '分析' },
        { id: 'products', label: '产品' },
        { id: 'orders', label: '订单' },
        { id: 'attributes', label: '属性' },
        { id: 'categories', label: '分类' }
    ],
    inventoryManager: [
        { id: 'dashboard', label: '仪表盘' },
        { id: 'analytics', label: '分析' },
        { id: 'products', label: '产品' },
        { id: 'orders', label: '订单' },
        { id: 'attributes', label: '属性' },
        { id: 'categories', label: '分类' }
    ],

};

export default function CreateNewUser({
    user,
    open,
    onOpenChange,
}) {
    const [selectedCapabilities, setSelectedCapabilities] = useState([]);
    const [activeRole, setActiveRole] = useState('admin');
    const session = useSession();
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);


    const handleToggleCapability = (capabilityId) => {
        setSelectedCapabilities(prev => {
            if (prev.includes(capabilityId)) {
                return prev.filter(id => id !== capabilityId);
            }
            return [...prev, capabilityId];
        });
    };


    const formSchema = z.object({
        email: z.string()
            .min(1, { message: "This field has to be filled." })
            .email("This is not a valid email."),
        password: z.string()
            .min(8, { message: "Password must be at least 8 characters long." })
            .refine((password) => {
                // Strong password regex: at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
                const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return strongPasswordRegex.test(password);
            }, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
        role: z.string(),
        capabilities: z.array(z.string()).optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            role: "admin",
            capabilities: []
        },
    });

    const handlerChangeTab = (tab) => {
        setActiveRole(tab)
    }




    const onSubmitForm = async (values) => {
        const randomUserName = values?.email + Math.random(5);


        const submissionData = {
            ...values,
            role: activeRole,
            capabilities: selectedCapabilities,
            username: randomUserName
        };


        try {
            setIsLoading(true);

            const res = await apiReq('register', "POST", submissionData);

            const data = await res?.json();

            if (res?.status === 200) {
                toast.success("Success!", {
                    description: "Successfully registered you will re-direct to the login page",
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
        console.log('user', open);
        // setOpenDialog(user && Object.keys(user).length === 0);
    }, [open]);

    return (
        <div>
            <Dialog open={openDialog} onOpenChange={() => {
                setOpenDialog(false);
                // onClose();
            }}>
                {!user && <Button onClick={() => setOpenDialog(true)}>创建账户</Button>}
                <DialogContent className="sm:max-w-[825px]">
                    <DialogHeader>
                        <DialogTitle>创建新帐户</DialogTitle>
                        <DialogDescription>请在此处修改您的个人资料。完成后点击保存。</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                        <Tabs
                            defaultValue="admin"
                            className="w-auto"
                            onValueChange={(value) => {
                                setActiveRole(value);
                                form.setValue('role', value);
                                setSelectedCapabilities([]); // Reset capabilities when tab changes
                            }}
                        >
                            <TabsList className="grid w-full grid-cols-5 rounded-3xl" onValueChange={handlerChangeTab}>
                                <TabsTrigger value="admin" className="rounded-3xl">管理员</TabsTrigger>
                                <TabsTrigger value="manager" className="rounded-3xl">经理</TabsTrigger>
                                <TabsTrigger value="sales" className="rounded-3xl">销售人员</TabsTrigger>
                                <TabsTrigger value="marketing" className="rounded-3xl">市场营销</TabsTrigger>
                                <TabsTrigger value="inventoryManager" className="rounded-3xl">库存管理员</TabsTrigger>
                            </TabsList>

                            {Object.entries(ROLE_CAPABILITIES).map(([role, capabilities]) => (
                                <TabsContent key={role} value={role} className="mt-4">
                                    <div className="space-y-4">
                                        {capabilities.map(cap => (
                                            <div key={cap.id} className="flex items-center space-x-4">
                                                <Switch
                                                    checked={selectedCapabilities.includes(cap.id)}
                                                    onCheckedChange={() => handleToggleCapability(cap.id)}
                                                />
                                                <Label>{cap.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>

                        <RegisterForm form={form} onSubmitForm={onSubmitForm} loading={isLoading} activeRole={activeRole}/>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
