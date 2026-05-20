'use client';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { apiReq, formatPrice, orderStatus } from '@/lib/common';
import { Earth, HandCoins, Loader2, LoaderCircle, Mail, MapPin, PackageSearch, Phone, ScanFace, ShoppingCart, Signpost, SquareKanban } from 'lucide-react';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';


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

export default function CustomerFullView({ userId, onUpdateUser }) {
    const [user, setUser] = useState({});
    const [billingAddress, setBillingAddress] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [enabledCapabilitiesButton, setEnabledCapabilitiesButton] = useState(false);
    const [isLoadingCapSave, setIsLoadingCapSave] = useState(false);
    const [selectedCapabilities, setSelectedCapabilities] = useState([]);

    const session = useSession();

    const handleToggleCapability = (capabilityId) => {
        setSelectedCapabilities(prev => {
            if (prev.includes(capabilityId)) {
                return prev.filter(id => id !== capabilityId);
            }
            return [...prev, capabilityId];
        });
    };



    const calculateTotals = (parches) => {
        return parches.reduce((acc, order) => {
            order.items.forEach(item => {
                acc.totalItems += item.quantity;
                acc.totalPrice += item.price * item.quantity;
            });
            return acc;
        }, { totalItems: 0, totalPrice: 0 });
    };


    const getUserData = async (id) => {
        try {
            setIsLoading(true);
            const res = await apiReq(`admin/customers?id=${id}`, 'GET');

            const { data } = await res.json();
            if (res.ok) {

                const getValidOrder = data?.userMeta?.parches.filter((d) => !d.delete);

                const payload = {
                    ...data,
                    userMeta: {
                        ...data?.userMeta,
                        parches: getValidOrder
                    }
                }

                if (data?.user?.capabilities) {
                    setSelectedCapabilities(data.user.capabilities);
                }

                setUser(payload);

                if (data?.userMeta) {
                    const getDefault = data?.userMeta?.billingAddress.find((d) => d.isDefault);

                    setBillingAddress(getDefault);
                }
            }

            setIsLoading(false)

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    const areArraysEqual = (array1, array2) => {
        if (array1.length !== array2.length) return false;
        return array1.every((element, index) => element === array2[index]);
    };

    const handlerSaveCapabilities = async () => {
        
        try {
            setIsLoadingCapSave(true);

            const res = await apiReq(`admin/user`, 'POST', {
                capabilities: selectedCapabilities,
                id: user?.user?._id
            });

            if(!res.ok){
                toast.error("出现错误")
            }

            const { data } = await res.json();

            onUpdateUser(data);

            setIsLoadingCapSave(false);

            toast.success("更新成功！")
        } catch (error) {
            setIsLoadingCapSave(false);
        } finally {
            setIsLoadingCapSave(false);
        }
    }

    useEffect(() => {
        if (userId) getUserData(userId);
    }, [userId]);
    
    
    useEffect(() => {
        if(user?.user?.capabilities && selectedCapabilities){
            const isEqual = areArraysEqual(selectedCapabilities, user?.user?.capabilities);
            setEnabledCapabilitiesButton(isEqual);
        }
        
    }, [selectedCapabilities, user]);


    return isLoading ? <div className="flex items-center justify-center flex-col p-5">
        <Loader2 className='animate-spin' />
        <p className="text-sm text-muted-foreground">请稍候...</p>
    </div> : user && user?.user && Object.keys(user).length !== 0 ? (
        <div className="flex flex-col space-y-5 max-h-[calc(100vh-40px)] overflow-y-auto">
            <div className='flex items-center justify-center relative pt-5 mb-3'>
                <div className='absolute left-0 top-0 w-full h-2/3 bg-slate-50 z-0' />
                {isLoading ? <Skeleton className='w-[100px] h-[100px] rounded-full' /> : <div className='w-[100px] h-[100px] rounded-full bg-slate-200 text-center flex items-center justify-center z-10 font-extrabold uppercase'>{user?.user?.firstName?.charAt(0)}{user?.user?.lastName?.charAt(0)}</div>}
            </div>
            <div className='text-center mb-5'>
                <h4 className='text-center font-semibold text-md leading-3'>{user?.user?.firstName} {user?.lastName}</h4>
                <a href={`mailto:${user?.user?.email}`} className='text-xs text-muted-foreground'>{user?.user?.email}</a>
            </div>

            <div className="p-3 bg-slate-50 ">
                <h4 className="font-bold text-sm mb-3">基本信息</h4>
                <div className=' grid grid-cols-2 grid-flow-row gap-5'>
                    <div className='flex gap-2 items-start'>
                        <MapPin className='w-4 h-4 text-muted-foreground' />
                        <div>
                            <span className='text-xs text-muted-foreground uppercase block'>地址</span>
                            <div className='text-sm text-gray-600'>
                                <div>{billingAddress && billingAddress?.street}</div>
                                <div>{billingAddress && billingAddress?.addressLine2 ? billingAddress && billingAddress?.addressLine2 + ',' : ''}</div>
                                {billingAddress && billingAddress?.city}<br />
                            </div>
                        </div>
                    </div>
                    {billingAddress?.country && <div className='flex gap-2 items-start'>
                        <Earth className='w-4 h-4 text-muted-foreground' />
                        <div>
                            <span className='text-xs text-muted-foreground uppercase block'>国家</span>
                            <div className='text-sm text-gray-600'>{billingAddress?.country}</div>
                        </div>
                    </div>}
                    <div className='flex gap-2 items-start'>
                        <Signpost className='w-4 h-4 text-muted-foreground' />
                        <div>
                            <span className='text-xs text-muted-foreground uppercase block'>邮政编码</span>
                            <div className='text-sm text-gray-600'>{billingAddress?.zip}</div>
                        </div>
                    </div>
                    <div className='flex gap-2 items-start'>
                        <Mail className='w-4 h-4 text-muted-foreground' />
                        <div>
                            <span className='text-xs text-muted-foreground uppercase block'>电子邮箱</span>
                            <div className='text-sm text-gray-600'>{user?.user?.email}</div>
                        </div>
                    </div>
                    {billingAddress?.phone && <div className='flex gap-2 items-start'>
                        <Phone className='w-4 h-4 text-muted-foreground' />
                        <div>
                            <span className='text-xs text-muted-foreground uppercase block'>电话</span>
                            <div className='text-sm text-gray-600'>{billingAddress?.phone}</div>
                        </div>
                    </div>}
                    {/* <div className='flex gap-2 items-start'>
                        <MousePointer className='w-4 h-4 text-muted-foreground' />
                        <div>
                            <span className='text-xs text-muted-foreground uppercase block'>IP地址</span>
                            <div className='text-sm text-gray-600'>123.23</div>
                        </div>
                    </div> */}
                    {user?.userMeta?.parches && user?.userMeta?.parches.length > 0 && <div className='flex gap-2 items-start'>
                        <HandCoins className='w-4 h-4 text-muted-foreground' />
                        <div>
                            <div className='text-xs text-muted-foreground uppercase flex items-center gap-2'>总消费 (<div className='text-[10px] text-muted-foreground uppercase'>不含运费</div>)</div>
                            <div className='text-sm text-gray-600'><span className="font-extrabold">{formatPrice(calculateTotals(user?.userMeta?.parches).totalPrice)}</span></div>

                        </div>
                    </div>}
                    {user?.userMeta?.parches && user?.userMeta?.parches.length > 0 && <div className='flex gap-2 items-start'>
                        <SquareKanban className='w-4 h-4 text-muted-foreground' />
                        <div>
                            <span className='text-xs text-muted-foreground uppercase block'>总购买</span>
                            <div className='text-sm text-gray-600'><span className="font-extrabold">{calculateTotals(user?.userMeta?.parches).totalItems}</span></div>
                        </div>
                    </div>}
                </div>
            </div>

            <div className="mt-5">
                <h4 className="flex items-center gap-2 uppercase mb-3"><PackageSearch strokeWidth={1} className='w-8 h-8 text-muted-foreground' />感兴趣产品</h4>
                {user && user?.userMeta && user?.userMeta?.interestProducts && user?.userMeta?.interestProducts.length > 0 ? <Carousel>
                    <CarouselContent>
                        {user?.userMeta?.interestProducts.map((d, i) => (
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={`ip_${d._id}_${i}`}>
                                <Link href={`/admin/product/${d?._id}`} className="border-[1px] rounded-sm p-3 block">
                                    <p className="text-sm">{d?.title}</p>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>


                    <CarouselPrevious className="left-auto right-10 -top-10 -translate-y-0" />
                    <CarouselNext className="right-0 -top-10 -translate-y-0" />

                </Carousel> : <>
                    <p>未找到感兴趣产品</p>
                </>}
            </div>
            <div className="mt-5">
                <h4 className="flex items-center gap-2 uppercase mb-3"><ShoppingCart strokeWidth={1} className='w-8 h-8 text-muted-foreground' />订单</h4>
                {user && user?.userMeta && user?.userMeta?.parches && user?.userMeta?.parches.length > 0 ? <Carousel>
                    <CarouselContent>
                        {user?.userMeta?.parches.map((d, i) => (
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={`ip_${d._id}_${i}`}>
                                <Link href={`/admin/orders/${d?._id}`} className="border-[1px] rounded-sm p-3 block">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm">订单ID</p>
                                        <p className="text-sm font-semibold">#{d?.customOrderId}</p>
                                    </div>
                                    <p className="text-xs">状态: {orderStatus().find((st) => st.value === d?.status).label}</p>
                                    <p className="text-xs">{moment(d.createdAt).format('lll')}</p>
                                </Link>
                            </CarouselItem>))
                        }
                    </CarouselContent>


                    <CarouselPrevious className="left-auto right-10 -top-10 -translate-y-0" />
                    <CarouselNext className="right-0 -top-10 -translate-y-0" />

                </Carousel> : <>
                    <p>未找到订单</p>
                </>}
            </div>


            {user?.user?.role !== "user" && session?.data?.user?.role === "admin" && <div className='p-5 bg-slate-50 space-y-5'>
                <h4 className="flex items-center gap-2 uppercase mb-3"><ScanFace strokeWidth={1} className='w-8 h-8 text-muted-foreground font-semibold' />权限</h4>

                {ROLE_CAPABILITIES[user?.user?.role]?.map((capabilities, i) => (
                    <div key={capabilities.id} className="flex items-center space-x-4">
                        <Switch
                            checked={selectedCapabilities.includes(capabilities.id)}
                            onCheckedChange={() => handleToggleCapability(capabilities.id)}
                        />
                        <Label>{capabilities.label}</Label>
                    </div>
                ))}

                {!enabledCapabilitiesButton && <Button onClick={handlerSaveCapabilities} className="flex items-center gap-2" disabled={isLoadingCapSave}>{isLoadingCapSave && <LoaderCircle size={12}/>}保存更改</Button>}

            </div>}


        </div>
    ) : (
        <div >未找到用户数据</div>
    )
}
