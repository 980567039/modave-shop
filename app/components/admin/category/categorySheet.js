"use client";

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React, { useEffect, useState } from 'react'
import AddNewCategory from './addNewCategory'

export default function CategorySheet({ open, onCloseSheet, onSubmit, edit }) {
    const [isEdit , setIsEdit] = useState(false);

    useEffect(() => {
        if(edit && Object.keys(edit).length !== 0){
            setIsEdit(true);
        }

        return () => {
            setIsEdit(false);
        }
    }, [edit]);
    return (
        <div>
            <Sheet open={open} onOpenChange={onCloseSheet}>
                <SheetContent className="min-w-[800px] p-0">
                    <SheetHeader className="mb-3 p-5">
                        <SheetTitle>{isEdit ? "更新" : "添加新"}分类</SheetTitle>
                        <SheetDescription>
                            {isEdit ? "更新" : "添加新"}分类以将其包含在您的主分类列表中。
                        </SheetDescription>
                    </SheetHeader>
                    <div className="overflow-y-auto max-h-[calc(100%-180px)] px-5">
                        <AddNewCategory onSubmit={onSubmit} onCloseSheet={onCloseSheet} edit={edit}/>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
