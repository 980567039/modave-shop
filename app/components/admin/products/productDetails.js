"use client"
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { z } from 'zod'
import { CircleHelp, CirclePlus, Coins, LoaderCircle, Pencil } from 'lucide-react'
import CategorySelection from '../category/categorySelection'
import AddNewMaterial from '../material/addNewMaterial'
import { AdminContext } from '@/app/contexts/adminContexts'
import { RainbowButton } from '@/components/ui/rainbow-button'
import AiGenerateContent from '../../aiGenerateContent'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { apiReq } from '@/lib/common'
import Image from 'next/image'


// Custom hook for debounce
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};


export default function ProductDetails({
    controller,
    setValue,
    clearErrors,
    getValues,
    setError,
    editData
}) {
    const { material, isLoading, store } = useContext(AdminContext);
    const [openCreateNewMaterial, setOpenCreateNewMaterial] = useState(false);
    const [isCheckingSlug, setIsCheckingSlug] = useState(false);
    const [allSizeCharts, setAllSizeCharts] = useState([]);

    const checkSlugExists = useCallback(async (slug) => {
        setIsCheckingSlug(true);

        try {
            const response = await apiReq(`admin/product/check-slug?slug=${slug}`, 'GET');

            const data = await response.json();

            if (data.exists) {
                // If the slug exists, set an error
                setError('titleSlug', {
                    type: 'custom',
                    message: '此别名已存在。请选择一个不同的别名。'
                });
            } else {
                // If the slug doesn't exist, clear the error
                clearErrors('titleSlug');
            }
        } catch (error) {
            console.error('Error checking slug:', error);
        } finally {
            setIsCheckingSlug(false);
        }
    }, [controller]);

    const debouncedSlug = useDebounce(getValues('titleSlug'), 500);


    useEffect(() => {
        if (debouncedSlug && editData?.titleSlug !== debouncedSlug) {
            checkSlugExists(debouncedSlug);
        }
    }, [debouncedSlug, checkSlugExists, editData]);

    const handlerProductNameChange = (val) => {
        const cleanedStr = val.replace(/[^a-z0-9\s]/gi, '');
        const hyphenatedStr = cleanedStr.replace(/\s+/g, '-').toLowerCase();
        setValue('titleSlug', hyphenatedStr);
        customDeboneTyping(hyphenatedStr);
    }

    const handlerSlugChange = (val) => {
        // Only allow lowercase letters, numbers, and hyphens
        const cleanedStr = val.replace(/[^a-z0-9-]/g, '');
        // Remove any leading or trailing hyphens
        const trimmedStr = cleanedStr.replace(/^-+|-+$/g, '');
        // Replace multiple consecutive hyphens with a single hyphen
        const finalStr = trimmedStr.replace(/-+/g, '-');
        // Update the titleSlug value
        setValue('titleSlug', finalStr);

        customDeboneTyping(finalStr)

    }

    const customDeboneTyping = (text) => {
        setTimeout(() => {
            checkSlugExists(text);
        }, 1000)
    }



    const handlerAiContent = (d) => {
        setValue('description', d);
    }

    useEffect(() => {
        if (store && store?.theme?.common?.sizeCharts) {
            setAllSizeCharts(store?.theme?.common?.sizeCharts);
        }
    }, [store]);


    return (
        <div className='space-y-5'>
            <div className='p-5 border-[1px] rounded-3xl'>
                <h4 className='text-xl font-semibold mb-2'>基本产品信息</h4>

                <div className='space-y-5'>
                    <FormField
                        control={controller}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>产品名称</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="产品名称"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            handlerProductNameChange(e.target.value)
                                        }}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    这是您公开展示的产品名称。使用SEO友好的名称以便在搜索引擎中获得更好的曝光。
                                </FormDescription>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={controller}
                        name="titleSlug"
                        render={({ field }) => (
                            <FormItem>
                                {/* <FormLabel>Slug name</FormLabel> */}
                                <FormControl>
                                    <Input
                                        placeholder="别名"
                                        {...field}
                                        onChange={(e) => {
                                            const newValue = e.target.value.toLowerCase();
                                            handlerSlugChange(newValue);
                                            field.onChange(newValue);
                                        }}
                                        onKeyPress={(e) => {
                                            // Prevent any key that's not a letter, number, or hyphen
                                            if (!/[a-z0-9-]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    {isCheckingSlug ? "正在检查可用性..." : '此产品的别名将自动生成，并将作为产品的URL。'}
                                </FormDescription>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={controller}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>产品简短描述</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="产品简短描述" {...field} />
                                </FormControl>
                                {/* <FormDescription className="text-xs">
                                    This is your public display product name. use a SEO friendly name for the better reach in search engine
                                </FormDescription> */}
                                <FormMessage className="text-xs" />

                                <div className='flex justify-end'>
                                    <AiGenerateContent
                                        buttonTitle="生成描述"
                                        customPrompt="生成自定义产品描述"
                                        type="productDescription"
                                        limit={1500}
                                        basedOn={getValues('title')}
                                        onApply={handlerAiContent}
                                    />
                                </div>
                            </FormItem>
                        )}
                    />

                    <div className='flex items-center'>
                        <div>
                            <img src="/images/data-processing.png" alt="size image" width={300} height={300} />
                        </div>
                        <div className='flex-1'>
                            <FormField
                                control={controller}
                                name="sizeChart"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>尺码表</FormLabel>
                                        <FormControl>
                                            <>
                                                {isLoading?.type === "sizeChart" && isLoading?.isLoading ? <LoaderCircle className='animate-spin w-6 h-6' /> : <>
                                                    <Select {...field} onValueChange={(v) => field.onChange(v)} className="w-full">
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="尺码表" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="--">未选择尺码表</SelectItem>
                                                            {allSizeCharts && allSizeCharts.length > 0 && allSizeCharts.map((chart) => (
                                                                <SelectItem key={chart.id} value={chart.uniqueId}>{chart.title}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </>}
                                            </>
                                        </FormControl>
                                        {/* <FormDescription className="text-xs">
                                                    This is your public display product name. use a SEO friendly name for the better reach in search engine
                                                </FormDescription> */}
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={controller}
                                name="modelInfo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>模特信息（可选）</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Model Height 5 8, wearing size UK 10" {...field} />
                                        </FormControl>
                                        {/* <FormDescription className="text-xs">
                                            This is your public display product name. use a SEO friendly name for the better reach in search engine
                                        </FormDescription> */}
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='p-5 border-[1px] rounded-3xl'>
                <div className='mb-2 flex items-center gap-3'>
                    <Coins size={30} strokeWidth={1.2} />
                    <div>
                        <h5 className='text-md font-semibold'>价格</h5>
                        <p className='text-xs text-muted-foreground'>产品价格</p>
                    </div>
                </div>

                <div className='grid grid-cols-3 grid-flow-row gap-4 p-3 bg-slate-50 rounded-lg'>
                    <div className='flex-2 gap-3'>
                        <FormField
                            control={controller}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>常规价格</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="价格"
                                            {...field}
                                            onChange={(e) => {
                                                const cleanedStr = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                                                field.onChange(Number(cleanedStr));
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        如果您想为每个变体添加价格，可以从&quot;变体&quot;选项卡中进行设置。这将是主要产品价格。
                                    </FormDescription>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex-1 gap-3'>
                        <FormField
                            control={controller}
                            name="salePrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>促销价格</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="促销价格"
                                            {...field}
                                            onChange={(e) => {
                                                const cleanedStr = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                                                field.onChange(cleanedStr.toString());
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        *可选
                                    </FormDescription>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex-1 gap-3'>
                        <FormField
                            control={controller}
                            name="actualPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>实际成本</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="实际成本"
                                            {...field}
                                            onChange={(e) => {
                                                const cleanedStr = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                                                field.onChange(cleanedStr.toString());
                                            }}
                                        />
                                    </FormControl>
                                    <HoverCard>
                                        <HoverCardTrigger className='flex gap-1 items-center text-xs text-muted-foreground'><CircleHelp className='w-4 h-4' />帮助</HoverCardTrigger>
                                        <HoverCardContent>
                                            <p className="text-xs">
                                                这是可选的。如果您输入实际成本，将使您以后能够在仪表板中轻松查看总利润。这不会显示在店面上。
                                            </p>
                                        </HoverCardContent>
                                    </HoverCard>


                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

            </div>

            <div className="space-y-4 p-5 border-[1px] rounded-3xl">
                <div className='flex gap-4'>
                    <div className='w-4/12'>
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
                    <div className='w-4/12'>
                        <FormField
                            control={controller}
                            name="mappedSku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>绑定B站产品SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="绑定B站产品SKU" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        绑定B站产品SKU
                                    </FormDescription>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='w-4/12'>
                        <FormField
                            control={controller}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center justify-between mb-4">
                                        <div>可用库存</div>
                                        <div className='text-xs text-muted-foreground'>0 = 缺货</div>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="20"
                                            {...field}
                                            onChange={(e) => {
                                                const cleanedStr = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                                                field.onChange(Number(cleanedStr));
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        输入当前库存数量。随着客户从在线商店购买，这个数字将自动减少。
                                    </FormDescription>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                </div>

                <div className='flex gap-3 items-end'>
                    <FormField
                        control={controller}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>分类</FormLabel>
                                <FormControl>
                                    <CategorySelection />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                </div>
                <div className="grid grid-cols-2 grid-flow-row gap-4">
                    <div className='flex gap-3 items-end'>
                        <FormField
                            control={controller}
                            name="material"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>材质</FormLabel>
                                    <FormControl>
                                        <>
                                            {isLoading?.type === "material" && isLoading?.isLoading ? <LoaderCircle className='animate-spin w-6 h-6' /> : <>
                                                <Select {...field} onValueChange={(v) => field.onChange(v)} className="w-full">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="材质" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="--">无材质</SelectItem>
                                                        {material && material.length > 0 && material.map((mat) => (
                                                            <SelectItem key={mat._id} value={mat._id}>{mat.title}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </>}
                                        </>
                                    </FormControl>
                                    {/* <FormDescription className="text-xs">
                                            This is your public display product name. use a SEO friendly name for the better reach in search engine
                                        </FormDescription> */}
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <Button type="button" variant="outlined" className="text-xs font-normal text-green-700" onClick={() => setOpenCreateNewMaterial(true)}><CirclePlus className="w-4 h-4 mr-2" />创建新材质</Button>
                    </div>
                    <FormField
                        control={controller}
                        name="materialComposition"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>材质成分</FormLabel>
                                <FormControl>
                                    <Input placeholder="例如：100%聚酯纤维" {...field} className="w-full" />
                                </FormControl>
                                {/* <FormDescription className="text-xs">
                                            This is your public display product name. use a SEO friendly name for the better reach in search engine
                                        </FormDescription> */}
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <AddNewMaterial open={openCreateNewMaterial} onClose={() => setOpenCreateNewMaterial(false)} />


        </div>
    )
}
