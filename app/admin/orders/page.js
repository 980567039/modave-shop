"use client"
import AdminHeader from '@/app/components/adminHeader'
import { DatePickerWithRange } from '@/app/components/common/datePickerWithRange'
import { CommonDataTable } from '@/app/components/commonDataTable'
import { AdminContext } from '@/app/contexts/adminContexts'
import { Badge } from '@/components/ui/badge'
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiReq, formatPrice, orderStatus } from '@/lib/common'
import { ArchiveRestore, ArrowUpDown, MoreHorizontal, Plus, Search } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import { toast } from 'sonner'
import { child, onValue, push, ref, set } from 'firebase/database'
import { database } from '@/lib/firebase'
import SoundController from '@/app/components/soundController'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import OrderView from '@/app/components/admin/orders/orderView'
import RestrictPage from '@/app/components/admin/restrictPage/restrictPage'


export default function Orders() {
  const route = useRouter();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(50); // 每页记录数
  const [skip, setSkip] = useState(1); // 分页的跳过数量（起始索引）
  const [totalOrderCount, setTotalOrderCount] = useState(0); // 订单总数
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [filterDates, setFilterDates] = useState({});
  const [showFilterButton, setShowFilterButton] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPickupOrderChecked, setIsPickupOrderChecked] = useState(false);
  const [openOrderDetails, setOpenOrderDetails] = useState({
    isOpen: false,
    id: ''
  });

  // 根据订单总数和每页限制计算总页数
  const totalPages = Math.ceil(totalOrderCount / limit);

  const allOrderStatus = orderStatus();
  const { store, setStore } = useContext(AdminContext);

  const statusColorChanger = (status) => {
    switch (status) {
      case "Confirmed":
        return "text-green-600";
      case "Confirm Payment":
        return "text-green-600";
      case "Awaiting Payment":
        return "text-black/40";
      case "Payment Failed":
        return "text-red-600";
      case "Completed":
        return "text-blue-600";
      case "Payment Cancel":
        return "text-red-600";
      case "Cancelled":
        return "text-red-600";
      case "Pending":
        return "text-[#d6c113]";

      default:
        return '';
    }
  }

  const renderOfferText = (original) => {
    if (original?.isOfferItem && original?.typeOfOffer?.enabledKokoOffer && original?.payment?.type === "koko") {
      return (
        <span className='block text-xs text-muted-foreground'>{original?.typeOfOffer?.kokoParentage}%（已应用 {original?.typeOfOffer?.kokoOffersText}）</span>
      )
    } else if (original?.isOfferItem && original?.typeOfOffer?.enabledOffer && original?.payment?.type !== "koko") {
      return (
        <span className='block text-xs text-muted-foreground'>{original?.typeOfOffer?.parentage}% 优惠已应用</span>
      )
    }
  }

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
      accessorKey: "orderId",
      header: "订单ID",
      cell: ({ row }) => {
        const getOriginal = row.original;
        return (
          <div
            className={`capitalize cursor-pointer hover:underline w-[150px]`}
            onClick={() => route.push(`/admin/orders/${row.original.id}`)}
          >
            {row.getValue("orderId")}
            {/* {renderOfferText(getOriginal)} */}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <div className={`capitalize ${statusColorChanger(status)}`}>{status}</div>
        )
      },
    },
    {
      accessorKey: "customer",
      header: ({ column }) => {
        return (
          <div className="capitalize">客户</div>
        )
      },
      cell: ({ row }) => <div className="capitalize text-sm">{row.getValue("customer")}</div>,
    },
    {
      accessorKey: "address",
      header: ({ column }) => {

        return (
          <div className="capitalize">地址</div>
        )
      },
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="capitalize">{!data?.isPickupOrder ? data?.address : <>
            {data?.isPickupOrder !== "delivery" && <div className='text-xs text-muted-foreground flex items-center'><ArchiveRestore className='w-4 h-4 mr-1' />自提订单</div>}
            {data?.isPickupOrder !== "delivery" ? data?.pickUpLocation : data?.address}
          </>}</div>
        )
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <div className="capitalize">日期</div>
        )
      },
      cell: ({ row }) => <div className="flex flex-col gap-1">
        {moment(row.getValue("date")).startOf('minutes').fromNow()}
        <span className='text-xs text-muted-foreground'>{moment(row.getValue("date")).format('lll')}</span>
      </div>,
    },
    // {
    //   accessorKey: "paymentStatus",
    //   header: ({ column }) => {
    //     return (
    //       <div className="capitalize">支付状态</div>
    //     )
    //   },
    //   cell: ({ row }) => <div className="capitalize">{row.getValue("paymentStatus")}</div>,
    // },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">金额</div>,
      cell: ({ row }) => {
        const data = row.original;
        const amount = parseFloat(row.getValue("amount"))

        return <div className="text-right font-medium">{formatPrice(amount)}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const data = row.original;

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
                className="cursor-pointer"
                onClick={() => {
                  setOpenOrderDetails({
                    isOpen: true,
                    id: row.original?.id
                  })
                }}
              >
                查看订单
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!data?.hideDelete && <DropdownMenuItem onClick={() => handlerOrderDelete(data)}>删除</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handlerOrderDelete = async (row) => {
    // 添加确认对话框
    const isConfirmed = window.confirm("您确定要删除此订单吗？");

    if (!isConfirmed) {
      return; // 如果用户取消则退出
    }

    try {
      const res = await apiReq('admin/order/update', 'POST', {
        id: row?.id,
        delete: true,
      });

      if (!res.ok) {
        toast.error("出现错误！", {
          description: '订单更新失败'
        })
      }

      const resData = await res.json();

      const filterRemovedOrder = data.filter((d) => d.id !== row?.id);
      setData(filterRemovedOrder);

      if (resData && resData?.data?.orderCount) {
        setStore((prevState) => ({
          ...prevState,
          orderCount: resData?.data?.orderCount,
        }));
      }

    } catch (error) {
      console.log(error);
    }
  }


  const getOrders = async (limit, page, status, from, to, search, isPickup = null) => {
    try {
      setIsLoading(true);

      let url = `admin/order?limit=${limit}&page=${page}`;

    

      if (from) {
        url = url + '&from=' + moment(from).format('YYYY-MM-DD');
      }
      if (to) {
        url = url + '&to=' + moment(to).format('YYYY-MM-DD');
      }

      if (status) {
        url = url + `&status=` + status
      }

      if (search) {
        url = url + `&search=` + encodeURIComponent(search);
      }

      if (isPickup === true) {
        url = url + `&fulfillmentType=pickup`;
      } else if (isPickup === false) {
        url = url + `&fulfillmentType=delivery`;
      }

      const res = await apiReq(url, 'GET');

      if (res && res.status === 200) {
        const { data } = await res.json();

        setTotalOrderCount(data?.orderCount);

        const reFormat = data?.orders?.map((order) => {
          const totalAmount = order?.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
          }, 0);

          // console.log("row===", order);


          return {
            id: order._id,
            orderId: order.customOrderId,
            status: allOrderStatus?.find((d) => d.value === order?.status)?.label,
            customer: order?.billingAddress?.firstName,
            address: `${order?.billingAddress?.street}, ${order?.billingAddress?.addressLine2 ? order?.billingAddress?.addressLine2 + ',' : ''} ${order?.billingAddress?.city}`,
            date: moment(order?.date),
            amount: order?.paymentId?.amount,
            isNew: order?.isNewOrder,
            isPickupOrder: order?.fulfillmentType || false,
            pickUpLocation: order?.pickUpLocation || '',
            pickupDate: order?.pickupDate || "",
            isOfferItem: order?.offersApplied || false,
            typeOfOffer: order?.typeOfOffer || {},
            hideDelete: store?.loginUserData?.role === 'admin' ? false : true,
          }
        });

        setData(reFormat);
      } else {
        setData([]);
      }

      setIsLoading(false);

    } catch (error) {
      console.log(error);
      toast.error("出现错误！", {
        description: '获取数据时出错，请稍后再试！'
      })
      setIsLoading(false);
    }
  }

  const debouncedGetOrders = useCallback(
    debounce((limit, page, status, from, to, search, isPickupChecked) => {
      getOrders(limit, page, status, from, to, search, isPickupChecked);
    }, 300),
    []
  );


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    debouncedGetOrders(limit, 1, selectedTab, filterDates?.from, filterDates?.to, value);
  }

  const handlePageChange = (newPage) => {
    const newSkip = (newPage - 1) * limit;
    setCurrentPage(newPage);
    setSkip(newSkip);
    getOrders(limit, newPage, selectedTab); // 为新页面重新获取数据
  };


  const handlerChangeTab = (tab) => {
    if (tab) {
      setSelectedTab(tab);
      if (filterDates && Object.keys(filterDates).length !== 0) {
        const { from, to } = filterDates;
        // 在 getOrders 调用中包含 isPickupOrderChecked 状态
        getOrders(limit, currentPage, tab, from, to, searchTerm, isPickupOrderChecked);
      } else {
        // 在 getOrders 调用中包含 isPickupOrderChecked 状态
        getOrders(limit, currentPage, tab, null, null, searchTerm, isPickupOrderChecked);
      }
    }
  };
  const handlerChangeDate = (date) => {
    setFilterDates(date);
    if (date && Object.keys(date).length !== 0) {
      setShowFilterButton(true);
    } else {
      setShowFilterButton(false);
    }
  }

  const handlerFilterSubmit = () => {
    const { from, to } = filterDates;

    setCurrentPage(1);
    getOrders(limit, 1, selectedTab, from, to);
  }
  
  const handlerFilterPickup = () => {
    const isPickupChecked = !isPickupOrderChecked;
    setIsPickupOrderChecked(isPickupChecked);
    setCurrentPage(1);
    
    // 获取当前过滤日期（如果有）
    const from = filterDates?.from || null;
    const to = filterDates?.to || null;
    
    // 使用更新后的自提过滤器调用 getOrders
    getOrders(
      limit,
      1,
      selectedTab,
      from,
      to,
      searchTerm,
      isPickupChecked
    );
  };


  useEffect(() => {
    getOrders(limit, currentPage, selectedTab, null, null, searchTerm, isPickupOrderChecked);
  }, [limit]);


  if (!store?.loginUserData?.capabilities?.includes('orders')) {
    return <RestrictPage />;
  } else {
    return (
      <div>
        <AdminHeader title="订单">
          
        </AdminHeader>

        <div className='flex flex-col gap-3 mt-5'>
          <div className='space-y-3'>
            <div className='flex items-end gap-3'>
              <div>
                <p className='text-xs mb-2'>按日期范围筛选</p>
                <DatePickerWithRange onDateChange={handlerChangeDate} onClearDates={() => getOrders(limit, currentPage, selectedTab)} />
              </div>

              {showFilterButton && <Button onClick={handlerFilterSubmit}>筛选</Button>}
            </div>
          </div>
          

          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-3'>
              <Tabs defaultValue="all" className="w-fit" onValueChange={handlerChangeTab}>
                <TabsList className="flex items-center w-auto rounded-full h-auto px-2" >
                  <TabsTrigger value="all" className="rounded-full flex gap-3">全部</TabsTrigger>
                  <TabsTrigger value="new" className="rounded-full flex gap-3">新订单
                    {store?.orderCount > 0 && (
                      <Badge className="ml-auto flex h-6 shrink-0 items-center justify-center rounded-full">
                        {store?.orderCount}
                        {store?.orderCount > 10 && <Plus className="h-3 w-3 ml-0.5" />} 新
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="processing" className="rounded-full flex gap-3">处理中</TabsTrigger>
                  <TabsTrigger value="onHold" className="rounded-full flex gap-3">暂挂</TabsTrigger>
                  <TabsTrigger value="shipped" className="rounded-full flex gap-3">已发货</TabsTrigger>

                  <TabsTrigger value="completed" className="rounded-full flex gap-3">已完成</TabsTrigger>
                  <TabsTrigger value="cancelled" className="rounded-full flex gap-3 text-red-500" >已取消</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button variant={isPickupOrderChecked ? "default" : "outline"} className="rounded-full flex gap-2" onClick={handlerFilterPickup}>
                <ArchiveRestore className='w-4 h-4' />自提订单
              </Button>

            </div>

            <div className='relative'>
              <Search className='absolute left-2 top-2 w-5 h-5 text-gray-400' />
              <Input
                type="text"
                placeholder="按订单ID、客户名称或邮箱搜索订单"
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch} />
            </div>
          </div>



          <CommonDataTable
            columns={columns}
            data={data}
            loading={isLoading}
          />


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
        </div>


        <Sheet
          open={openOrderDetails?.isOpen}
          onOpenChange={() => {
            setOpenOrderDetails({
              isOpen: false,
              id: ''
            })
          }}>
          <SheetContent className="min-w-[90vw]">
            <SheetHeader>
              <SheetTitle>订单详情</SheetTitle>
              <SheetDescription className="max-h-[90vh] overflow-y-auto text-black">
                <OrderView orderId={openOrderDetails?.id} isGetNew={true} />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>


      </div>
    )
  }


}
