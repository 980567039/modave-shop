import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'


export default function ProductInventory({ controller }) {

    return (
        <div className='space-y-5'>
            <div className='mb-2'>
                <h4 className='text-xl font-semibold'>产品库存</h4>
                <p className='text-xs text-muted-foreground'>添加产品库存详情</p>
            </div>

            <FormField
                control={controller}
                name="sku"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>产品SKU</FormLabel>
                        <FormControl>
                            <Input placeholder="产品SKU" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                            SKU指的是库存单位，是每个不同产品和可购买服务的唯一标识符。
                        </FormDescription>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
        </div>
    )
}
