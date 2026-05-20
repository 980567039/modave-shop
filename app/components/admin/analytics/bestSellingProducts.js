import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { apiReq, formatPrice } from '@/lib/common';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function BestSellingProducts({
    from,
    to
}) {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getData = async (f, t) => {
        try {
            setLoading(true);
            const res = await apiReq(
                `admin/analytics/best-selling-products?from=${moment(f).format('YYYY-MM-DD')}&to=${moment(t).format('YYYY-MM-DD')}`,
                'GET'
            );

            const { data, pagination } = await res.json();
            if (res.ok) {
                setData(data);
                setPagination(pagination)
            } else {
                setError('');
            }
        } catch (error) {
            console.error('获取畅销产品时出错:', error);
            setError('获取数据失败');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const checkFrom = from ? from : moment().format('YYYY-MM-DD');
        const checkTo = to ? to : moment().format('YYYY-MM-DD');
        getData(checkFrom, checkTo);
    }, [from, to]);

    if (loading) {
        return (
            <div className="p-5 border rounded-3xl space-y-3 w-full flex-1 animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 border rounded-3xl space-y-3 w-full flex-1">
                <p className="text-red-500">错误: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-5 border rounded-3xl space-y-3 w-full flex-1">
            <div>
                <h4 className="text-xl font-bold">畅销产品</h4>
                <p className="text-xs text-muted-foreground">
                    从 {moment(from).format('MMM DD, YYYY')} 到 {moment(to).format('MMM DD, YYYY')} 的热销产品
                </p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px] text-xs">产品</TableHead>
                        <TableHead className="text-xs">SKU</TableHead>
                        <TableHead className="text-right text-xs">销售数量</TableHead>
                        <TableHead className="text-right text-xs">产品价格</TableHead>
                        <TableHead className="text-right text-xs">总收入</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((product) => (
                        <TableRow key={product._id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12">
                                        <img
                                            src={product.productImage || "/images/placeholder.jpg"}
                                            alt={product.productName}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <span className="line-clamp-1 max-w-[130px]">{product.productName}</span>
                                </div>
                            </TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell className="text-right">{product.totalQuantity}</TableCell>
                            <TableCell className="text-right">{product.productPrice}</TableCell>
                            <TableCell className="text-right">
                                {formatPrice(product.totalRevenue)}
                            </TableCell>

                        </TableRow>
                    ))}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6">
                                所选日期范围内未找到产品
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {pagination?.hasMore && <div className='text-xs italic text-muted-foreground'>还有 {pagination?.remaining} 行可用</div>}
        </div>
    )
}