"use client";

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImagePlus, Minus, PlusCircle, PlusIcon, Trash, Trash2, Undo2 } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import MediaLibrary from '../../mediaLibrary';
import { AdminContext } from '@/app/contexts/adminContexts';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FormField } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SelectProductAttributes({ controller, setValue, getValues }) {
    const { attributes, isLoading } = useContext(AdminContext);
    const [mainStock, setMainStock] = useState(getValues('stock') || 0);
    const [remainingStock, setRemainingStock] = useState(mainStock);
    const [totalEnteredStock, setTotalEnteredStock] = useState(0);
    const [showAlert, setShowAlert] = useState(false);

    const [openImageModal, setOpenImageModal] = useState({
        isOpen: false,
        row: {}
    });

    const initialAttributesState = attributes.reduce((acc, attr) => {
        acc[attr.slug] = '';
        return acc;
    }, {});

    const [rows, setRows] = useState([
        { id: 1, image: false, stock: '', price: '', attributes: initialAttributesState }
    ]);

    const handleAddRow = () => {
        setRows([...rows, { id: rows.length + 1, image: false, stock: '', price: '', attributes: initialAttributesState }]);
    };

    const handleRemoveRow = (id) => {
        const updatedRows = rows
            .filter(row => row.id !== id)
            .map((row, index) => ({ ...row, id: index + 1 }));
        setRows(updatedRows);
        setValue("attributes", updatedRows);
        updateStockCounts(updatedRows);
    };

    const handleInputChange = (id, field, value) => {
        if (/^\d*$/.test(value)) { // Only allow numeric values
            const updatedRows = rows.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            );
            setRows(updatedRows);
            setValue("attributes", updatedRows);
            if (field === 'stock') {
                updateStockCounts(updatedRows);
            }
        }
    };

    const updateStockCounts = (updatedRows) => {
        const newTotalEnteredStock = updatedRows.reduce((sum, row) => sum + (parseInt(row.stock) || 0), 0);
        setTotalEnteredStock(newTotalEnteredStock);
        const newRemainingStock = mainStock - newTotalEnteredStock;
        setRemainingStock(newRemainingStock);
        setShowAlert(newRemainingStock < 0);
    };

    const handleAttributeChange = (id, attribute, value) => {
        let payload = {
            value
        };

        if(attribute === 'color'){
            const getColors = attributes.find((cl) => cl.slug === 'color')
            const getSelectedColor = getColors?.terms.find((term) => term.slug === value);
            payload = {
                value,
                colorObject: getSelectedColor.color,
            }
        }

        const updatedRows = rows.map(row =>
            row.id === id ? { ...row, attributes: { ...row.attributes, [attribute]: payload } } : row
        );
        setRows(updatedRows);
        setValue("attributes", updatedRows);
    };

    const handlerImageSelect = (image) => {
        const updatedRows = rows.map(row => {
            if (row.id === openImageModal.row.id) {
                return {
                    ...row,
                    image: image?.url
                };
            }
            return row;
        });

        setRows(updatedRows);
        setValue("attributes", updatedRows);
        setOpenImageModal({
            isOpen: false,
            row: {}
        })
    }

    const handlerRemoveImage = (row) => {
        const updatedRows = rows.map(d => {
            if (d.id === row.id) {
                return {
                    ...d,
                    image: false
                };
            }
            return d;
        });

        setRows(updatedRows);
        setValue("attributes", updatedRows);
    }

    useEffect(() => {
        const getAttributes = getValues("attributes");
        const getStock = getValues("stock");
        if(getAttributes && getAttributes.length > 0){
            setRows(getAttributes);
            updateStockCounts(getAttributes);
        }

        if(getStock){
            setMainStock(getStock);
            setRemainingStock(getStock);
        }
    }, [getValues]);

    return (
        <div className='space-y-5 p-5 border-[1px] rounded-3xl'>
            <div className='mb-2'>
                <h4 className='text-xl font-semibold'>产品变体</h4>
                <p className='text-xs text-muted-foreground'>添加产品变体</p>
            </div>

            <div className='flex justify-between items-center text-sm text-muted-foreground'>
                <div>总库存: {mainStock}</div>
                <div>已输入库存: {totalEnteredStock}</div>
                <div>剩余库存: {mainStock  - totalEnteredStock}</div>
            </div>

            {showAlert && (
                <Alert variant="destructive">
                    <AlertTitle>警告</AlertTitle>
                    <AlertDescription>
                        输入的总库存超过了可用的主库存。请调整数值。
                    </AlertDescription>
                </Alert>
            )}

            <div className='space-y-3'>
                <FormField
                    control={controller}
                    name="attributes"
                    render={({ field }) => rows.map((row) => (
                        <div key={row.id} className='flex gap-3 justify-between items-center'>
                            <div className='flex gap-3 items-center'>
                                <div onClick={() => !row?.image ? setOpenImageModal({
                                    isOpen: true,
                                    row,
                                }) : {}} className='min-w-[50px] overflow-hidden border-dashed border-2 rounded-2xl h-[50px] flex items-center justify-center hover:border-primary cursor-pointer transition-all ease-in-out delay-75'>
                                    {row?.image ? <>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger><img src={row?.image} alt={`attr_${row.id}`} width={50} height={50} /></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handlerRemoveImage(row)} className="text-sm cursor-pointer text-red-500 flex gap-1">
                                                    <Minus className='w-4 h-4' />
                                                    <span className='text-xs'>移除</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-sm cursor-pointer flex gap-1" onClick={() => setOpenImageModal({
                                                    isOpen: true,
                                                    row,
                                                })}>
                                                    <Undo2 className='w-4 h-4' />
                                                    <span className='text-xs'>替换图片</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </> : <ImagePlus className='w-5 h-5 text-muted-foreground' strokeWidth={1}/>}
                                </div>
    
                                {attributes.map(attr => (
                                    <Select
                                        key={attr._id}
                                        value={row.attributes[attr.slug].value || ''}
                                        onValueChange={(value) => handleAttributeChange(row.id, attr.slug, value)}
                                    >
                                        <SelectTrigger className="min-w-[100px]">
                                            <SelectValue placeholder={"选择 " + attr.name} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {attr.terms.map(term => (
                                                <SelectItem key={term.slug} value={term.slug}>{term.termName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ))}
                                <div className='min-w-[100px]'>
                                    <Input
                                        type="text"
                                        placeholder="库存"
                                        value={row.stock}
                                        onChange={(e) => handleInputChange(row.id, 'stock', e.target.value)}
                                    />
                                </div>
                                <div className='min-w-[100px]'>
                                    <Input
                                        type="text"
                                        placeholder="价格"
                                        value={row.price}
                                        onChange={(e) => handleInputChange(row.id, 'price', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                <Button onClick={() => handleRemoveRow(row.id)} className="bg-red-200 rounded-full p-2 w-8 h-8 hover:bg-red-300">
                                    <Trash className='text-red-500 w-4 h-4' />
                                </Button>
                            </div>
                        </div>
                    ))} />
            </div>

            <div onClick={handleAddRow} className="flex flex-col gap-3 p-5 border-[1px] border-dashed border-gray-300 rounded-3xl w-full items-center justify-center hover:border-gray-400 cursor-pointer">
                <PlusCircle className='w-10 h-10 text-muted-foreground' strokeWidth={0.8} />
                <span>添加新变体</span>
            </div>

            <Dialog open={openImageModal?.isOpen} onOpenChange={() => setOpenImageModal({
                isOpen: false,
                row: {},
            })}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择图片</DialogTitle>
                        <p className='text-xs text-muted-foreground mb-3 block'>您可以从媒体库中选择图片或直接从本地电脑上传。</p>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={handlerImageSelect} />
                </DialogContent>
            </Dialog>
        </div>
    )
}