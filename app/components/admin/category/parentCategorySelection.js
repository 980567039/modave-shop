"use client";
import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { apiReq, formatCategories } from '@/lib/common';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function ParentCategorySelection({ onChangeValue, edit }) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState(edit?.parentId || "");

    const getAllCategories = async () => {
        try {
            setIsLoading(true);
            const res = await apiReq(`admin/product/category?delete=false`, 'GET');

            if (res && res.status === 200) {
                const { data } = await res.json();
                setCategories(formatCategories(data));
            } else {
                setCategories([]);
            }

            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        } finally { setIsLoading(false); }
    }

    useEffect(() => {
        // get all categories
        getAllCategories();
    }, []);

    useEffect(() => {
        let selectedCat = categories.find((d) => d._id === value);
        onChangeValue(value, selectedCat);
    }, [value, categories]);



    return (
        <div>
            <DropdownMenu open={open} onOpenChange={setOpen} className="min-w-full max-w-full p-0">
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {isLoading ? <LoaderCircle className='animate-spin w-6 h-6' /> : <>
                            {value
                                ? categories.find((category) => category._id === value)?.title
                                : "无父级"}

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </>}

                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-full max-w-full w-[760px] p-0">
                    <Command className="min-w-full">
                        {/* <CommandInput placeholder="搜索分类..." /> */}
                        <CommandList>
                            <CommandEmpty>未找到分类。</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    value={""}
                                    onSelect={(currentValue) => {
                                        setValue("")
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === "" ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    无父级
                                </CommandItem>
                                {categories && categories.length > 0 && categories.map((category) => (
                                    <CommandItem
                                        key={category._id}
                                        value={category._id}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === category._id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {category.title}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
