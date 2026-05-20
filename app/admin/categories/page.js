"use client";
import ActionButton from '@/app/components/actionButton';
import CategorySheet from '@/app/components/admin/category/categorySheet';
import RestrictPage from '@/app/components/admin/restrictPage/restrictPage';
import AdminHeader from '@/app/components/adminHeader'
import TrashButton from '@/app/components/trashButton'
import { AdminContext } from '@/app/contexts/adminContexts';
import { BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiReq, formatCategories } from '@/lib/common';
import { LoaderCircle, PencilIcon, Plus, RotateCcw, Search } from 'lucide-react'
import moment from 'moment';
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner';

export default function Categories() {
    const [openCreateNewCategory, setOpenCreateNewCategory] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [cloneData, setCloneData] = useState([]);
    const [currentTab, setCurrentTab] = useState("all");
    const [editObject, setEditObject] = useState({});
    const [rowDeleteLoading, setRowDeleteLoading] = useState({
        id: null,
        isLoading: false
    });


    const { store } = useContext(AdminContext);

    const getAllAttributes = async (isDelete, tab) => {
        try {
            setIsLoading(true);
            const res = await apiReq(`admin/product/category?delete=${isDelete}`, 'GET');

            if (res && res.status === 200) {
                const { data } = await res.json();

                console.log("data===", data);
                

                setData(tab === "all" ? formatCategories(data) : data);
                setCloneData(data);
            } else {
                setData([]);
                setCloneData([]);
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


    const handlerSubmitCategory = (record) => {
        const findAny = cloneData.some((d) => d._id === record._id);

        let updateData = [];

        if (findAny) {
            updateData = cloneData?.map((d) => {
                if (d._id === record._id) {
                    return {
                        ...record
                    }
                }
                return d
            });
        } else {
            updateData = [...cloneData, record];
        }


        setData(currentTab === "all" ? formatCategories(updateData) : updateData);
        setCloneData(updateData);
    }

    /**
     * Handles the confirmation of a row deletion or restoration.
     * 
     * @param {Object} row - The row to be deleted or restored.
     * @param {Boolean} isDelete - A flag indicating whether to delete (true) or restore (false) the row.
     */
    const handlerConfirm = async (row, isDelete) => {
        /**
         * Check if the row and its ID exist.
         * If they do, proceed with the deletion or restoration.
         */
        if (row && row._id) {
            try {
                /**
                 * Create an update payload with the row's ID and the deletion flag.
                 */
                const updatePayload = {
                    id: row._id,
                    delete: isDelete
                }

                /**
                 * Set the loading state for the row deletion to true.
                 */
                setRowDeleteLoading({
                    id: row._id,
                    isLoading: true
                });

                /**
                 * Make a PUT request to the admin/product/category API endpoint with the update payload.
                 * This request is asynchronous, meaning it doesn't block the execution of the rest of the function.
                 */
                const response = await apiReq(`admin/product/category`, 'PUT', updatePayload);

                /**
                 * Check if the response was successful (200 OK).
                 * If it was, proceed with the deletion or restoration.
                 */
                if (response && response.status === 200) {
                    /**
                     * Filter out the deleted row from the data array.
                     */
                    const filteredData = data.filter((d) => d._id !== row._id);

                    /**
                     * Update the data and clone data with the filtered array.
                     */
                    setData(filteredData);
                    setCloneData(filteredData);

                    /**
                     * Show a success toast notification with a message indicating whether the category was moved to the trash or restored.
                     */
                    toast.success("成功", {
                        description: `${isDelete ? "已成功移至回收站" : "已成功恢复"} "${row.title}" 分类`,
                    });

                    /**
                     * Set the loading state for the row deletion to false.
                     */
                    setRowDeleteLoading({
                        id: row._id,
                        isLoading: false
                    });
                }
            } catch (error) {
                /**
                 * Log the error and show an error toast notification with a generic error message.
                 */
                console.log(error);
                toast.error("错误", {
                    description: `出现问题，请稍后再试`,
                });
            }
        }
    }

    const deletePermanently = async (category) => {
        if(category && category?._id){
            setRowDeleteLoading({
                id: category._id,
                isLoading: true
            });
            
            try {
                const response = await apiReq(`admin/product/category?id=${category._id}`, 'DELETE');
                if (response && response.status === 200) {

                    const filteredData = data.filter((d) => d._id !== category._id);

                    setData(filteredData);

                    toast.success("成功", {
                        description: "已成功删除",
                    });

                    setRowDeleteLoading({
                        id: category._id,
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

    useEffect(() => {
        if (currentTab === "trashed") {
            getAllAttributes(true, "trashed");
        } else {
            getAllAttributes(false, "all");
        }

    }, [currentTab]);


    useEffect(() => {
        getAllAttributes(false, "all");
    }, []);


    // if (!store?.loginUserData?.capabilities?.includes('categories')) {
    //     return <RestrictPage />;
    // } else{
        return (
            <div className='space-y-5'>
                <AdminHeader
                    title="分类"
                    buttons={<Button onClick={() => setOpenCreateNewCategory(true)}><Plus className='w-6 h-6 mr-1' />添加新分类</Button>}
                    descriptions='您可以在此处管理商店的产品分类。'
                >
    
                </AdminHeader>
    
                <div className='flex items-center justify-between mb-3'>
                    <Tabs defaultValue="all" className="w-fit" onValueChange={(d) => setCurrentTab(d)}>
                        <TabsList className="grid w-full grid-cols-2 rounded-full">
                            <TabsTrigger value="all" className="rounded-full flex gap-3">全部</TabsTrigger>
                            <TabsTrigger value="trashed" className="rounded-full flex gap-3">回收站</TabsTrigger>
                        </TabsList>
                    </Tabs>
    
                    <div className='relative'>
                        <Search className='absolute left-2 top-2 w-5 h-5 text-gray-400' />
                        <Input type="text" placeholder="搜索分类" className="pl-8" />
                    </div>
                </div>
    
                <div className='flex flex-col border-[1px] rounded-md'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>名称</TableHead>
                                <TableHead>别名</TableHead>
                                <TableHead>创建时间</TableHead>
                                <TableHead>更新时间</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center" align="center">
                                    <div>
                                        <LoaderCircle className='w-10 h-10 animate-spin inline-block' strokeWidth={0.8} />
                                    </div>
                                </TableCell>
                            </TableRow>}
                            {!isLoading && data.map(category => (
                                <TableRow key={category._id}>
                                    <TableCell>{category.title}</TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            {category.slug}
                                            <p className='text-xs text-muted-foreground'>{category.url}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{moment(category.createdAt).format("LLL")}</TableCell>
                                    <TableCell>{moment(category.updatedAt).format("LLL")}</TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-3">
                                        <Button className="w-9 h-9 rounded-full p-0" variant="outline" onClick={() => {
                                            setEditObject(cloneData?.find((d) => d._id === category._id));
                                            setOpenCreateNewCategory(true);
                                        }}>
                                            <PencilIcon className='w-4 h-4' />
                                        </Button>
                                        {category.delete ? <>
                                            <ActionButton
                                                title="确定吗？"
                                                content={`您确定要恢复 '${category?.title}' 分类吗？点击"继续"后，它将出现在"全部"标签下`}
                                                onContinue={() => handlerConfirm(category, false)}
                                                isLoading={rowDeleteLoading && rowDeleteLoading.id === category._id && rowDeleteLoading.isLoading}
                                                textColor=""
                                                buttonBackground=""
                                                buttonHover=""
                                                icon={<RotateCcw className=' w-4 h-4' />} />
    
                                            <TrashButton
                                                title="确定吗？"
                                                content={`您确定要永久删除此 "${category.title}" 属性吗？`}
                                                onContinue={() => deletePermanently(category)}
                                                isLoading={rowDeleteLoading && rowDeleteLoading.id === category._id && rowDeleteLoading.isLoading}
                                            />
                                        </> :
                                            <TrashButton
                                                title="确定吗？"
                                                content="您确定要删除此分类吗？删除此分类也将移除所有分配给它的子分类。我们建议在继续删除之前，将所有子分类重新分配给另一个父分类。"
                                                onContinue={() => handlerConfirm(category, true)}
                                                isLoading={rowDeleteLoading && rowDeleteLoading.id === category._id && rowDeleteLoading.isLoading}
                                            />}
                                    </TableCell>
                                </TableRow>
                            ))}
    
                            {data.length === 0 && !isLoading &&
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center" align="center">
                                        没有结果。
                                    </TableCell>
                                </TableRow>}
    
                        </TableBody>
                    </Table>
                </div>
    
                <CategorySheet
                    open={openCreateNewCategory}
                    onCloseSheet={() => {
                        setOpenCreateNewCategory(false);
                        setEditObject({})
                    }}
                    onSubmit={handlerSubmitCategory}
                    edit={editObject}
                />
            </div>
        )

    // }


}
