"use client";
import React, { useCallback, useContext, useEffect, useState } from 'react'
import AdminHeader from '@/app/components/adminHeader'
import { BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Loader2Icon, MoreHorizontal, Search } from 'lucide-react'
import { CommonDataTable } from '@/app/components/commonDataTable'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiReq, transformS3UrlsInObject } from '@/lib/common';
import moment from 'moment';
import Image from 'next/image';
import { AdminContext } from '@/app/contexts/adminContexts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

import { debounce } from 'lodash';
import { ComboSelect } from '@/app/components/common/comboSelect';
import StockAvailabilityCards from '@/app/components/admin/products/stockAvailabilityCards';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export default function Products() {
    const route = useRouter();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertData, setAlertData] = useState({});


    const [limit, setLimit] = useState(10); // 每页记录数
    const [skip, setSkip] = useState(1); // 分页的跳过数量（起始索引）
    const [totalProductCount, setTotalProductCount] = useState(0); // 产品总数
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('');

    const { categories } = useContext(AdminContext);


    // 根据产品总数和每页限制计算总页数
    const totalPages = Math.ceil(totalProductCount / limit);

    const getAllProducts = async (isDelete, limit, tab, search, category, page) => {
        try {
            let url = `admin/product?delete=${isDelete}&type=${tab}&limit=${limit}&page=${page}`;

            if (search) {
                url = url + `&search=` + encodeURIComponent(search);
            }
            if (category) {
                url = url + `&category=` + category;
            }


            setIsLoading(true);
            const res = await apiReq(url, 'GET');

            if (res && res.status === 200) {
                const { data } = await res.json();




                if (data && data?.products && data?.products.length > 0) {

                    setTotalProductCount(data?.productCount)

                    const reFormat = data?.products?.map((product) => {

                        const filteredTitles = categories
                            .filter(category => product.category.includes(category._id))
                            .map(category => category.title)
                            .join(', ');

                        return {
                            id: product._id,
                            image: product?.defaultImage?.url || false,
                            name: product?.title || '--',
                            sku: product.sku || "--",
                            stock: product.inStock ? "有库存" : "缺货",
                            attributes: product?.attributes || [],
                            categories: filteredTitles || '无分类',
                            date: moment(product.createdAt).format("ll"),
                            objectData: product,
                            visibility: product.visibility || false
                        }
                    });

                    setData(transformS3UrlsInObject(reFormat));
                } else {
                    setData([]);
                }

            } else {
                setData([]);
            }

            setIsLoading(false);

        } catch (error) {
            console.log(error);
            toast.error("出现错误！", {
                description: '获取数据时出错，请稍后再试！',
            })
            setIsLoading(false);
        }
    }


    const columns = [
        {
            id: "select",
            // header: ({ table }) => (
            //     <Checkbox
            //         checked={
            //             table.getIsAllPageRowsSelected() ||
            //             (table.getIsSomePageRowsSelected() && "indeterminate")
            //         }
            //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            //         aria-label="全选"
            //     />
            // ),
            // cell: ({ row }) => (
            //     <Checkbox
            //         checked={row.getIsSelected()}
            //         onCheckedChange={(value) => row.toggleSelected(!!value)}
            //         aria-label="选择行"
            //     />
            // ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "image",
            header: "图片",
            cell: ({ row }) => (
                <div className="cursor-pointer" onClick={() => route.push(`/admin/products/edit?id=${row.original.id}`)}>
                    <img src={row.getValue("image") || 'https://dummyimage.com/100x100/ddd/000'} alt="" width={50} height={50} />
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "名称",
            cell: ({ row }) => {
                const { original } = row;

                return (
                    <div className='flex flex-col gap-1'>
                        <div className="capitalize cursor-pointer hover:text-blue-500 hover:underline" onClick={() => route.push(`/admin/products/edit?id=${row.original.id}`)}>
                            {row.getValue("name")}
                        </div>
                        <div className='text-xs text-muted-foreground'>

                            <div className='flex items-center capitalize gap-2'>
                                {original?.attributes && original.attributes?.length > 0 && original?.attributes.map((d, i) => {
                                    return (
                                        <>
                                            {Number(d.stock) === 0 ?
                                                <HoverCard>
                                                    <HoverCardTrigger>
                                                        <div key={`${original.id}-${i}`} className={`text-${Number(d.stock) === 0 ? `red-500 underline` : ''}`}>
                                                            {d.attributes?.color?.value} <span className='uppercase'>{d.attributes?.size?.value}</span> <div className='block'> 库存: {d.stock}</div>
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent>
                                                        此属性相关产品库存不可用。
                                                    </HoverCardContent>
                                                </HoverCard>

                                                : <div key={`${original.id}-${i}`} className={`text-${Number(d.stock) <= 2 ? `yellow-500` : ''}`}>
                                                    {d.attributes?.color?.value} <span className='uppercase'>{d.attributes?.size?.value}</span> <div className='block'> 库存: {d.stock}</div>
                                                </div>}


                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "sku",
            header: ({ column }) => {
                return (
                    <div className="capitalize">SKU</div>
                )
            },
            cell: ({ row }) => <div className="capitalize text-sm">{row.getValue("sku")}</div>,
        },
        {
            accessorKey: "stock",
            header: ({ column }) => {
                return (
                    <div className="capitalize">库存</div>
                )
            },
            cell: ({ row }) => <div className="capitalize w-[100px]"><div className={`${row.getValue("stock") === "缺货" ? "text-red-600" : "text-green-600"}`}>{row.getValue("stock")}</div></div>,
        },
        {
            accessorKey: "categories",
            header: ({ column }) => {
                return (
                    <div className="capitalize">分类</div>
                )
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("categories")}</div>,
        },
        {
            accessorKey: "date",
            header: ({ column }) => {
                return (
                    <div className="capitalize">日期</div>
                )
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("date")}</div>,
        },
        {
            accessorKey: "visibility",
            header: ({ column }) => {
                return (
                    <div className="capitalize">可见性</div>
                )
            },
            cell: ({ row }) => <div className="text-center">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{row.getValue("visibility") ? <Eye className='w-5 h-5' /> : <EyeOff className='w-5 h-5' />}</TooltipTrigger>
                        <TooltipContent className="bg-black border-none">
                            <p className='text-xs text-white'>{row.getValue("visibility") ? '在商店前台可见' : '此产品不会在商店前台显示'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const original = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">打开菜单</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => route.push(`/admin/products/edit?id=${original.id}`)}
                                className="cursor-pointer"
                            >
                                编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setOpenAlert(true);
                                    setAlertData({
                                        title: '确定要删除吗！',
                                        content: '您确定要删除此产品吗？',
                                        toDelete: original
                                    })
                                }}
                                className="text-red-500 cursor-pointer hover:text-red-500"
                            >
                                删除
                            </DropdownMenuItem>
                            {/* <DropdownMenuSeparator />
                            <DropdownMenuItem>查看客户</DropdownMenuItem>
                            <DropdownMenuItem>查看支付详情</DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];

    const handlerProductDelete = async () => {
        // setOpenAlert(false);
        setAlertData((prevData) => ({
            ...prevData,
            isLoading: true,
        }));


        try {
            const respond = await apiReq("admin/product", "PUT", {
                id: alertData?.toDelete?.id,
                delete: true,
            });

            if (!respond.ok) {
                toast.error('错误', {
                    description: '无法删除此产品，请稍后再试'
                })
            }


            setAlertData((prevData) => ({
                ...prevData,
                toDelete: {},
                isLoading: false,
            }));

            setOpenAlert(false);

            toast.success('删除成功！');

            setData((prevData) => ([
                ...prevData.filter((d) => d.id !== alertData?.toDelete?.id),
            ]));

        } catch (error) {
            toast.error('错误', {
                description: error
            });

            setAlertData((prevData) => ({
                ...prevData,
                toDelete: {},
                isLoading: false,
            }));
        } finally {
            setAlertData((prevData) => ({
                ...prevData,
                toDelete: {},
                isLoading: false,
            }));
        }
    }

    const handlerClickRow = (row) => {
        route.push(`/admin/products/edit?id=${row.id}`);
    }

    const handlerChangeTab = (tab) => {
        setSelectedTab(tab)
        if (tab === 'trashed') {
            getAllProducts(true, limit, tab, searchTerm, selectedCategory, currentPage);
        } else {
            getAllProducts(false, limit, tab, searchTerm, selectedCategory, currentPage);
        }
    }

    const handlePageChange = (newPage) => {
        const newSkip = (newPage - 1) * limit;
        setCurrentPage(newPage);
        setSkip(newSkip);
        getAllProducts(false, limit, selectedTab, searchTerm, selectedCategory, newPage); // 为新页面重新获取数据
    };


    const debouncedGetOrders = useCallback(
        debounce((isDelete, limit, tab, search, selectedCategory, page) => {
            getAllProducts(isDelete, limit, tab, search, selectedCategory, page);
        }, 300),
        []
    );


    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        debouncedGetOrders(false, limit, selectedTab, value, selectedCategory, currentPage);
    }

    const handleSelectCategory = (category) => {
        setSelectedCategory(category)
        getAllProducts(false, limit, selectedTab, searchTerm, category, currentPage)

    }

    useEffect(() => {
        getAllProducts(false, limit, 'all', searchTerm, selectedCategory, currentPage);
    }, [])

    return (
        <div className='space-y-5'>
            <AdminHeader
                title="产品"
                buttons={
                    <>
                        <Button onClick={() => route.push('/admin/products/add')}>添加新产品</Button>
                    </>
                }
            >
            </AdminHeader>

            {/* 库存更新 */}

            <StockAvailabilityCards />



            <div className='flex items-end justify-between mb-3'>
                <div className='flex items-end gap-3'>
                    <Tabs defaultValue="all" className="w-fit" onValueChange={handlerChangeTab}>
                        <TabsList className="grid w-full grid-cols-4 rounded-full">
                            <TabsTrigger value="all" className="rounded-full flex gap-3">全部</TabsTrigger>
                            <TabsTrigger value="inStock" className="rounded-full flex gap-3">有库存</TabsTrigger>
                            <TabsTrigger value="outOfStock" className="rounded-full flex gap-3 text-red-500">缺货</TabsTrigger>
                            <TabsTrigger value="sku" className="rounded-full flex gap-3">SKU</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* <Tabs defaultValue="" className="w-fit" onValueChange={handlerChangeTab}>
                        <TabsList className="grid w-full grid-cols-1 rounded-full">
                            <TabsTrigger value="trashed" className="rounded-full flex gap-3 text-red-500">已删除</TabsTrigger>
                        </TabsList>
                    </Tabs> */}

                    <div className='flex flex-col gap-1'>
                        <ComboSelect
                            type="category"
                            label="按分类筛选"
                            data={categories}
                            onSelectItem={handleSelectCategory}
                        />
                    </div>
                </div>

                <div className='relative'>
                    <Search className='absolute left-2 top-2 w-5 h-5 text-gray-400' />
                    <Input
                        type="text"
                        placeholder="按名称或SKU搜索产品"
                        className="pl-8"
                        value={searchTerm}
                        onChange={handleSearch} />
                </div>
            </div>

            <CommonDataTable
                columns={columns}
                data={data}
                onRowClick={(d) => handlerClickRow(d)}
                loading={isLoading} />

            {/* 分页控件 */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    第 {currentPage} 页，共 {totalPages} 页
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        上一页
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        下一页
                    </Button>
                </div>
            </div>


            <AlertDialog open={openAlert} onOpenChange={() => setOpenAlert(false)}>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertData?.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertData.content}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <Button onClick={handlerProductDelete} disabled={alertData?.isLoading} className="flex items-center gap-2">{alertData?.isLoading && <Loader2Icon className='w-4 h-4 animate-spin' />}继续</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
