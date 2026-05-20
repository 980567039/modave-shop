"use client";

import ViewCustomerData from '@/app/components/admin/customers/viewCustomerData';
import RestrictPage from '@/app/components/admin/restrictPage/restrictPage';
import AdminHeader from '@/app/components/adminHeader';
import { CommonDataTable } from '@/app/components/commonDataTable';
import CreateNewUser from '@/app/components/customer/createNewUser';
import TrashButton from '@/app/components/trashButton';
import { AdminContext } from '@/app/contexts/adminContexts';
import { BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiReq } from '@/lib/common';
import { Eye, Search } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'

export default function Customers() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openSheet, setOpenSheet] = useState(false);
    const [userData, setUserData] = useState({});

    const { store } = useContext(AdminContext);

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="全选"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="选择行"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "customUserId",
            header: "ID",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("customUserId")}</div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className="capitalize">姓名</div>
                )
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <div className="capitalize">邮箱</div>
                )
            },
            cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "role",
            header: ({ column }) => {
                return (
                    <div className="capitalize">角色</div>
                )
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <div className="capitalize">注册时间</div>
                )
            },
            cell: ({ row }) => <div className="capitalize">{moment(row.getValue("createdAt")).format("LLL")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const data = row.original;
                
                return (
                    <div className='flex justify-end gap-3'>
                        <Button className="w-9 h-9 rounded-full p-0" variant="outline" onClick={() => {
                            setOpenSheet(true);
                            setUserData(data)
                        }}>
                            <Eye className='text-gray-500' />
                        </Button>
                        {/* <TrashButton /> */}
                    </div>
                )
            },
        },
    ];

    const getAllUsers = async (type) => {
        try {
            setIsLoading(true);

            const res = await apiReq(`admin/customers?type=${type}`, 'GET');

            if (res && res.status === 200) {
                const { data } = await res.json();
                const reFormat = data?.map((user) => {
                    return {
                        ...user,
                        name: `${user?.firstName || '-'} ${user?.lastName || ''}`,
                    }
                })
                setData(reFormat);

            } else {
                setData([]);
            }

            setIsLoading(false);

        } catch (error) {
            console.log(error);
            toast.error("出错了！", {
                description: '获取数据时出现问题，请稍后再试！',
            })
            setIsLoading(false);
        }
    }

    const handlerChangeTab = (tab) => {
        getAllUsers(tab);
    }

    const createNewAccount = () => {
        alert("新文本")
    }

    const handlerUpdateUser = (updatedUser) => {
    
        const getUpdated = data?.map((d) => {
            if(d._id === updatedUser?._id){
                return {
                    ...d,
                    capabilities: updatedUser.capabilities
                }
            } 

            return d
        });
        
        
        setData(getUpdated)
    }


    useEffect(() => {
        getAllUsers("all");
    }, [])


    if (!store?.loginUserData?.capabilities?.includes('customers')) {
        return <RestrictPage />;
    } else {
        return (
            <div className='space-y-5'>
                <AdminHeader
                    title="客户"
                    descriptions='以下列出所有客户。您也可以按管理员用户进行筛选。'
                >
                    
                </AdminHeader>

                <div className='flex items-center justify-between mb-3'>
                    <Tabs defaultValue="all" onValueChange={handlerChangeTab}>
                        <TabsList className="flex items-center rounded-3xl">
                            <TabsTrigger value="all" className="rounded-3xl px-5">全部</TabsTrigger>
                            <TabsTrigger value="user" className="rounded-3xl px-5">用户</TabsTrigger>
                            <TabsTrigger value="admin" className="rounded-3xl px-5">管理员</TabsTrigger>
                            <TabsTrigger value="manager" className="rounded-3xl px-5">经理</TabsTrigger>
                            <TabsTrigger value="sales" className="rounded-3xl px-5">销售人员</TabsTrigger>
                            <TabsTrigger value="marketing" className="rounded-3xl px-5">市场营销</TabsTrigger>
                            <TabsTrigger value="inventoryManager" className="rounded-3xl px-5">库存管理员</TabsTrigger>
                            <TabsTrigger value="subscriber" className="rounded-3xl px-5">订阅者</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className='flex items-center gap-5'>
                        <CreateNewUser />

                        <div className='relative'>
                            <Search className='absolute left-2 top-2 w-5 h-5 text-gray-400' />
                            <Input type="text" placeholder="搜索客户" className="pl-8" />
                        </div>
                    </div>

                </div>

                <CommonDataTable columns={columns} data={data} onRowClick={() => { }} loading={isLoading} />

                <ViewCustomerData
                    openSheet={openSheet}
                    user={userData}
                    onUpdateUser={handlerUpdateUser}
                    onClose={() => {
                        setOpenSheet(false);
                        setUserData({});
                    }} />
            </div>
        )
    }


}
