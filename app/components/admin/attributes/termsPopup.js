"use client";

import { CornerRightDown, MoveRight, PlusCircle } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

import SelectColor from '../../common/selectColor';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const subAttFormSchema = z.object({
    termName: z.string().min(2, {
        message: "属性名称必须至少包含2个字符。",
    }).refine(value => value.trim().length > 0, {
        message: "属性名称不能为空。",
    }),
    slug: z.string().min(2, {
        message: "属性名称必须至少包含2个字符。",
    })
});

export default function TermsPopup({ onSubmit, attributeName, edit, disabledAddButton, allTerms }) {
    const [openModal, setOpenModal] = useState(false);
    const [color, setColor] = useState('');
    const [colorObject, setColorObject] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [terms, setAllTerms] = useState(allTerms || []);
    const dialogContentRef = useRef(null);

    const { control: termsController, handleSubmit: termsSubmit, setValue, reset, resetField } = useForm({
        resolver: zodResolver(subAttFormSchema),
        defaultValues: {
            termName: "",
            slug: "",
        },
    });

    const onSubmitForm = (values) => {
        let payload = values;
        if (colorObject && Object.keys(colorObject).length !== 0) {
            payload = {
                ...payload,
                color: colorObject,
            }
        }

        onSubmit(payload);
        setOpenModal(false);
    }

    const handlerNameChange = (val) => {
        const cleanedStr = val.replace(/[^\w\s.-]/gi, '-');
        // Replace spaces with hyphens
        const hyphenatedStr = cleanedStr.replace(/\s+/g, '-').toLowerCase();
        if (val && val.length > 2) {
            resetField('slug');
        }
        setValue('slug', hyphenatedStr.toLowerCase());
    }

    const handleChangeColor = (color) => {
        setColorObject(color)
        setColor(color?.hex)
    }

    const checkForColor = (text) => {
        const regex = /\bColors?\b/i; // Matches "Color" or "Colors" (case insensitive)
        const sizeRegex = /\bSizes?\b/i;
        if (regex.test(text)) {
            return '绿色';
        }
        if (sizeRegex.test(text)) {
            return '小';
        };
    };

    const clearFormData = () => {
        reset();
        setColor('');
    }

    // Handle modal open/close
    const handleDialogChange = (isOpen) => {
        if (!isOpen) {
            // Only run cleanup when closing
            clearFormData();
        }
        setOpenModal(isOpen);
    };

    // Focus management
    useEffect(() => {
        if (openModal && dialogContentRef.current) {
            // Set focus to first input when dialog opens
            setTimeout(() => {
                const firstInput = dialogContentRef.current.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 50);
        }
    }, [openModal]);

    // Clear form when modal closes
    useEffect(() => {
        if (!openModal) clearFormData();
    }, [openModal]);

    // Update terms list when allTerms prop changes
    useEffect(() => {
        setAllTerms(allTerms || []);
    }, [allTerms]);

    // Handle edit mode
    useEffect(() => {
        if (edit && Object.keys(edit).length !== 0) {
            setIsEdit(true);
            setOpenModal(true);
            setValue("termName", edit?.data?.termName || "");
            setValue("slug", edit?.data?.slug || "");
            setColor(edit?.data?.color?.hex || '');
        } else {
            setIsEdit(false);
        }
    }, [edit, setValue]);

    return (
        <>
            {!disabledAddButton && (
                <div
                    onClick={() => setOpenModal(true)}
                    className="flex flex-col gap-1 p-5 border-[1px] border-dashed border-gray-300 rounded-lg w-full items-center justify-center hover:border-gray-400 cursor-pointer"
                >
                    <PlusCircle className='w-10 h-10 text-muted-foreground' strokeWidth={0.8} />
                    <div className='flex items-center justify-center flex-col'>
                        <span>添加新属性</span>
                        <p className='text-xs text-muted-foreground'>属性属性可以分配给产品和变体。</p>
                    </div>
                </div>
            )}

            <Sheet open={openModal} onOpenChange={handleDialogChange}>
                <SheetContent className="min-w-[400px] p-0">
                    <SheetHeader className="mb-3 p-5">
                        <SheetTitle>{isEdit ? "编辑 " : "添加新"} {attributeName}
                            {isEdit && (
                                <>
                                    <MoveRight className='text-muted-foreground w-4 h-4' />
                                    {edit?.data?.termName}
                                </>
                            )}</SheetTitle>
                        <SheetDescription>
                            属性属性可以分配给产品和变体。
                        </SheetDescription>
                    </SheetHeader>
                    <div className="overflow-y-auto max-h-[calc(100%-180px)] px-5">
                        <Form {...termsController}>

                            <div className="space-y-3 my-3">
                                {attributeName && (
                                    <div className='flex gap-2 items-end'>
                                        <Badge>{attributeName}</Badge>
                                        <CornerRightDown className='text-muted-foreground' />
                                    </div>
                                )}
                                <FormField
                                    control={termsController}
                                    name="termName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>名称</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={`例如: ${checkForColor(attributeName) || '红色'}`}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        handlerNameChange(e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                名称是它在您网站上显示的方式。
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={termsController}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>别名</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="你的别名显示如此"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const cleanedStr = e.target.value.replace(/[^\w\s]/gi, '-');
                                                        field.onChange(cleanedStr.replace(/\s+/g, '-').toLowerCase());
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                属性的唯一别名/引用
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {attributeName && attributeName.toLowerCase().includes('color') && (
                                    <div className='space-y-3'>
                                        <FormLabel>选择颜色</FormLabel>
                                        <SelectColor onChange={handleChangeColor} value={color} />
                                    </div>
                                )}
                            </div>
                        </Form>
                    </div>
                    <div className="flex justify-end gap-2 p-5 border-t">
                        <Button variant="outline" onClick={() => setOpenModal(false)}>
                            取消
                        </Button>
                        <Button onClick={termsSubmit(onSubmitForm)}>
                            {isEdit ? "更新" : "添加"} 属性
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}