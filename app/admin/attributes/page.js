"use client";
import ActionButton from '@/app/components/actionButton';
import AddNewAttribute from '@/app/components/admin/attributes/addNewAttribute';
import RestrictPage from '@/app/components/admin/restrictPage/restrictPage';
import AdminHeader from '@/app/components/adminHeader';
import { CommonDataTable } from '@/app/components/commonDataTable';
import TrashButton from '@/app/components/trashButton';
import { AdminContext } from '@/app/contexts/adminContexts';
import { BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiReq } from '@/lib/common';
import { PencilIcon, RotateCcw, Search } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner';

export default function Attributes() {
    const route = useRouter();
    const [data, setData] = useState([]);
    const [editAttributeObject, setEditAttributeObject] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [rowDeleteLoading, setRowDeleteLoading] = useState({
        id: null,
        isLoading: false
    });

    const { store, setAttributes } = useContext(AdminContext);

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
            accessorKey: "name",
            header: "名称",
            cell: ({ row }) => (
                <div className="">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "slug",
            header: ({ column }) => {
                return (
                    <div className="capitalize">别名</div>
                )
            },
            cell: ({ row }) => <div className="text-sm">{row.getValue("slug")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <div className="capitalize">创建时间</div>
                )
            },
            cell: ({ row }) => <div className="capitalize">{moment(row.getValue("createdAt")).format("LLL")}</div>,
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => {
                return (
                    <div className="capitalize">更新时间</div>
                )
            },
            cell: ({ row }) => <div className="capitalize">{moment(row.getValue("updatedAt")).format("LLL")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const rowData = row.original

                return (
                    <div className='flex justify-end gap-3'>
                        <Button className="w-9 h-9 rounded-full p-0" variant="outline" onClick={() => setEditAttributeObject(row.original)}>
                            <PencilIcon className='w-4 h-4' />
                        </Button>

                        {row.original.delete ? <>
                            <ActionButton
                                title="确定吗？"
                                content={`您确定要恢复 '${row.original.name}' 属性吗？点击"继续"后，它将出现在"全部"标签下`}
                                onContinue={() => handlerConfirm(rowData, false)}
                                isLoading={rowDeleteLoading && rowDeleteLoading.id === rowData._id && rowDeleteLoading.isLoading}
                                textColor=""
                                buttonBackground=""
                                buttonHover=""
                                icon={<RotateCcw className=' w-4 h-4' />}
                            />
                            <TrashButton
                                title="确定吗？"
                                content={`您确定要永久删除此 "${row.original.name}" 属性吗？`}
                                onContinue={() => deletePermanently(row.original)}
                                isLoading={rowDeleteLoading && rowDeleteLoading.id === rowData._id && rowDeleteLoading.isLoading}
                            />
                        </> :
                            <TrashButton
                                title="确定吗？"
                                content={`您确定要删除此 "${row.original.name}" 属性吗？`}
                                onContinue={() => handlerConfirm(rowData, true)}
                                isLoading={rowDeleteLoading && rowDeleteLoading.id === rowData._id && rowDeleteLoading.isLoading}
                            />}
                    </div>
                )
            },
        },
    ];

    const handlerConfirm = async (row, isDelete) => {
        if (row && row._id) {
            try {

                const updatePayload = {
                    id: row._id,
                    delete: isDelete
                }

                setRowDeleteLoading({
                    id: row._id,
                    isLoading: true
                });

                const response = await apiReq(`admin/product/attribute`, 'PUT', updatePayload);


                if (response && response.status === 200) {

                    const filteredData = data.filter((d) => d._id !== row._id);

                    setData(filteredData);

                    if (isDelete) {
                        setAttributes(filteredData)
                    } else {
                        setAttributes((prevState) => ([
                            ...prevState,
                            row
                        ]))
                    }

                    toast.success("成功", {
                        description: `${isDelete ? "已成功移至回收站" : "已成功恢复"} "${row.name}" 属性`,
                    });

                    setRowDeleteLoading({
                        id: row._id,
                        isLoading: false
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error("错误", {
                    description: `出现问题，请稍后再试`,
                });
            }

        }
    }

    const deletePermanently = async (row) => {

        if (row && row?._id) {
            setRowDeleteLoading({
                id: row._id,
                isLoading: true
            });

            try {
                const response = await apiReq(`admin/product/attribute?id=${row._id}`, 'DELETE');
                if (response && response.status === 200) {

                    const filteredData = data.filter((d) => d._id !== row._id);

                    setData(filteredData);

                    toast.success("成功", {
                        description: "已成功删除",
                    });

                    setRowDeleteLoading({
                        id: row._id,
                        isLoading: false
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error("错误", {
                    description: `出现问题，请稍后再试`,
                });
            }
        }

    }

    const handlerNewRecord = (record) => {

        const findAny = data.some((d) => d._id === record._id);

        let updateData = [];

        if (findAny) {
            updateData = data?.map((d) => {
                if (d._id === record._id) {
                    return {
                        ...d,
                        name: record.name,
                        slug: record.slug,
                        createdAt: record.createdAt,
                        updatedAt: record.updatedAt,
                        terms: record.terms
                    }
                }
                return d
            });
        } else {
            updateData = [...data, record];
        }


        setData(updateData);
    }


    const getAllAttributes = async (isDelete) => {
        try {
            setIsLoading(true);
            const res = await apiReq(`admin/product/attribute?delete=${isDelete}`, 'GET');

            if (res && res.status === 200) {
                const { data } = await res.json();

                setData(data);
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
        if (tab === "trashed") {
            getAllAttributes(true);
        } else {
            getAllAttributes(false);
        }
    }

    useEffect(() => {
        getAllAttributes(false);
    }, []);

    
    

    // if (!store?.loginUserData?.capabilities?.includes('attributes')) {
    //     return <RestrictPage />;
    // } else{
        return (
            <div className='space-y-5'>
                <AdminHeader
                    title="属性"
                    buttons={
                        <>
                            <AddNewAttribute onSavedData={handlerNewRecord} edit={editAttributeObject} onCloseSheet={() => setEditAttributeObject({})} />
                        </>
                    }
                >
                    
                </AdminHeader>
    
                <div className='flex items-center justify-between mb-3'>
                    <Tabs defaultValue="all" className="w-fit" onValueChange={handlerChangeTab}>
                        <TabsList className="grid w-full grid-cols-2 rounded-full">
                            <TabsTrigger value="all" className="rounded-full flex gap-3">全部</TabsTrigger>
                            <TabsTrigger value="trashed" className="rounded-full flex gap-3">回收站</TabsTrigger>
                        </TabsList>
                    </Tabs>
    
                    <div className='relative'>
                        <Search className='absolute left-2 top-2 w-5 h-5 text-gray-400' />
                        <Input type="text" placeholder="搜索属性" className="pl-8" />
                    </div>
                </div>
    
                <CommonDataTable columns={columns} data={data} onRowClick={() => { }} loading={isLoading} />
    
            </div>
        )
    // }


}
