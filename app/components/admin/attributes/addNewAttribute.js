"use client";

import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, LoaderCircle, Plus } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TermsPopup from './termsPopup';
import ViewTerms from './viewTerms';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { apiReq } from '@/lib/common';

const createAttributeFormSchema = z.object({
    attrName: z.string().min(2, {
        message: "属性名称必须至少包含2个字符。",
    }),
    attrSlug: z.string().min(2, {
        message: "别名必须至少包含2个字符。",
    }),
})

export default function AddNewAttribute({
    onClick,
    onSavedData,
    edit, 
    onCloseSheet
}) {
    const [nameOfAttribute, setNameOfAttribute] = useState('');
    const [addedTerm, setAddedTerm] = useState([]);
    const [customAlter, setCustomAlter] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [openSheet, setOpenSheet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const sheetContentRef = useRef(null);

    const { control: attrController, handleSubmit: attrSubmit, setValue, reset, clearErrors } = useForm({
        resolver: zodResolver(createAttributeFormSchema),
        defaultValues: {
            attrName: "",
            attrSlug: "",
        },
    });

    const onSubmit = async (values) => {
        if (addedTerm && addedTerm.length === 0) {
            setCustomAlter(true);
            return false;
        }

        // send data to the API
        try {
            setIsLoading(true);
            const payload = {
                name: values.attrName,
                slug: values.attrSlug,
                terms: addedTerm,
            };

            let res;

            if (isEdit) {
                const addId = {
                    ...payload,
                    id: edit._id
                };

                res = await apiReq('admin/product/attribute', 'PUT', addId);
            } else {
                res = await apiReq('admin/product/attribute', 'POST', payload);
            }

            if (res && res.status === 200) {
                const { data } = await res.json();
                toast.success("成功", {
                    description: `成功${isEdit ? "更新" : "创建"}属性"${values.attrName}"`,
                });

                onSavedData(data);

                clearInputs();
                setIsLoading(false);
                handleSheetChange(false);
            }

        } catch (error) {
            console.log(error);
            toast.error("出现错误！", {
                description: '请稍后再试！',
            })
            setIsLoading(false);
        }
    }

    const handlerNameChange = (val) => {
        const cleanedStr = val.replace(/[^\w\s]/gi, '');
        // Replace spaces with hyphens
        const hyphenatedStr = cleanedStr.replace(/\s+/g, '-');
        setValue('attrSlug', hyphenatedStr.toLowerCase());
        clearErrors('attrSlug');
    }

    const handlerTermRowEdit = (data, index) => {
        setAddedTerm((prevState) => {
            const newState = [...prevState];
            newState[index] = { ...data };
            return newState;
        });
    }

    const handlerRemoveTerms = (data) => {
        setAddedTerm(data);
    }

    const handlerAddNewTerms = (newTerm) => {
        const isDuplicate = addedTerm.some(
            (existingTerm) =>
                existingTerm.termName.toLowerCase() === newTerm.termName.toLowerCase() &&
                existingTerm.slug.toLowerCase() === newTerm.slug.toLowerCase()
        );

        if (isDuplicate) {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 5000)
        } else {
            setAddedTerm((prevState) => ([
                ...prevState,
                newTerm
            ]));
            setCustomAlter(false);
            setError(false); // Reset error state if the term is successfully added
        }
    }

    const clearInputs = () => {
        reset();
        setValue('attrSlug', '');
        setAddedTerm([]);
    };

    // Handle sheet open/close
    const handleSheetChange = (isOpen) => {
        if (!isOpen) {
            clearInputs();
            if (onCloseSheet) onCloseSheet(true);
        }
        setOpenSheet(isOpen);
    };

    // Focus management effect
    useEffect(() => {
        if (openSheet && sheetContentRef.current) {
            // Set focus to first input when sheet opens
            setTimeout(() => {
                const firstInput = sheetContentRef.current.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 50);
        }
    }, [openSheet]);

    useEffect(() => {
        if (edit && Object.keys(edit).length !== 0) {
            setIsEdit(true);
            setOpenSheet(true);
            setAddedTerm(edit.terms || []);
            setValue('attrName', edit.name || '');
            setValue('attrSlug', edit.slug || '');
            setNameOfAttribute(edit.name || '');
        } else {
            setIsEdit(false);
        }
    }, [edit, setValue]);

    return (
        <>
            <Button 
                onClick={() => handleSheetChange(true)} 
                className='py-2 px-3 items-center text-sm text-white flex gap-2 bg-primary'
            >
                <Plus className='w-6 h-6' />
                添加新属性
            </Button>

            <Sheet open={openSheet} onOpenChange={handleSheetChange}>
                <SheetContent 
                    side="right" 
                    className="min-w-[800px] max-h-[100vh] overflow-y-auto"
                    ref={sheetContentRef}
                >
                    <SheetHeader>
                        <SheetTitle>{isEdit ? `编辑 ${edit?.name}` : "添加新"} 属性</SheetTitle>
                        <SheetDescription>
                            属性让您可以定义额外的产品数据，如尺寸或颜色。
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        {customAlter && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle className="text-xs">错误</AlertTitle>
                                <AlertDescription className="text-xs">
                                    未创建任何属性。请通过点击 - 添加新属性来创建至少一个属性。
                                </AlertDescription>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle className="text-xs">错误</AlertTitle>
                                <AlertDescription className="text-xs">
                                    您已经添加了这些属性。请添加不同的属性。
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        <Form {...attrController}>
                            <div className="space-y-3 my-3">
                                <FormField
                                    control={attrController}
                                    name="attrName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>名称</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="例如：颜色"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setNameOfAttribute(e.target.value);
                                                        handlerNameChange(e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                属性的名称（显示在前端）。
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={attrController}
                                    name="attrSlug"
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
                            </div>
                        </Form>

                        <ViewTerms 
                            terms={addedTerm} 
                            attributeName={nameOfAttribute} 
                            onEditRow={handlerTermRowEdit} 
                            onRemove={handlerRemoveTerms} 
                        />

                        {nameOfAttribute && nameOfAttribute.length > 2 && (
                            <TermsPopup 
                                onSubmit={handlerAddNewTerms} 
                                attributeName={nameOfAttribute} 
                                allTerms={addedTerm}
                            />
                        )}

                        <div className='flex justify-end'>
                            <Button 
                                type="button" 
                                onClick={attrSubmit(onSubmit)} 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                                        {isEdit ? '更新中' : '创建中'}
                                    </>
                                ) : (
                                    <>
                                        {isEdit ? "更新" : "创建"} 属性
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}