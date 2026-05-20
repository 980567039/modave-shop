import { Sheet, SheetContent } from '@/components/ui/sheet'
import React from 'react'
import CustomerFullView from './customerFullView'

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

export default function ViewCustomerData({ openSheet, onClose, user, onUpdateUser }) {
    return (
        <div>
            <Sheet open={openSheet} onOpenChange={onClose}>
                <SheetContent side={"right"} className="min-w-[800px]">
                    <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
                    <div>
                        <CustomerFullView userId={user?._id} onUpdateUser={onUpdateUser}/>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
