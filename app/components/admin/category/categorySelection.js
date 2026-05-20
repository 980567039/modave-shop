import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useContext, useEffect, useState } from 'react'
import CategorySheet from './categorySheet';
import { CirclePlus, LoaderCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { apiReq, formatCategories } from '@/lib/common';
import { AdminContext } from '@/app/contexts/adminContexts';
import { AdminProductContext } from '@/app/contexts/adminProductProvider';

export default function CategorySelection({ onCategorySelect, category }) {
    const { categories, setCategories, isLoading } = useContext(AdminContext);
    const { selectedCategories, setSelectedCategories } = useContext(AdminProductContext);

    const [openCreateNewCategory, setOpenCreateNewCategory] = useState(false);

    const handleCheckChange = (category) => {


        if (selectedCategories.some(cat => cat === category._id)) {
            // Remove the category if it exists in selectedCategories
            const updatedCategories = selectedCategories.filter(cat => cat !== category._id);
            setSelectedCategories(updatedCategories);
        } else {
            // Add the category if it does not exist in selectedCategories

            setSelectedCategories([...selectedCategories, category._id]);
        }
    };

    const handleAddNewCategory = (data) => {
        setCategories([...categories, {
            _id: data._id,
            parentId: data.parentId,
            title: data.title,
            slug: data.slug,
            url: data.url
        }]);
    }



    const getIndentationLevel = (title) => {
        const match = title.match(/^-+/);
        return match ? match[0].length : 0;
    };

    const formatCategoriesWithAddLevel = (categories) => {
        return formatCategories(categories).map(category => ({
            ...category,
            indentationLevel: getIndentationLevel(category.title),
            displayTitle: category.title.replace(/^-+/, '')
        }));
    };



    return (
        <div className='flex gap-3'>
            <ScrollArea className="h-[200px] w-[350px] border p-5">
                {isLoading?.type === "categories" && isLoading?.isLoading && <LoaderCircle className='animate-spin w-6 h-6' />}
                {categories && categories.length > 0 && formatCategoriesWithAddLevel(categories).map((category) => (
                    <div
                        className='flex gap-2 mb-2'
                        key={category._id}
                        style={{ marginLeft: `${category.indentationLevel * 20}px` }}
                    >
                        <Checkbox
                            id={category._id}
                            checked={selectedCategories.some((d) => d === category._id)}
                            onCheckedChange={() => handleCheckChange(category)}
                        />
                        <label
                            htmlFor={category._id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {category.displayTitle}
                        </label>
                    </div>
                ))}
            </ScrollArea>
            <Button type="button" onClick={() => setOpenCreateNewCategory(true)} className="text-xs font-normal text-green-700 flex py-3" variant="ghost">
                <CirclePlus className="w-4 h-4 mr-2" />创建新分类
            </Button>

            {/* Create new category sheet view */}
            <CategorySheet open={openCreateNewCategory} onCloseSheet={() => setOpenCreateNewCategory(false)} onSubmit={handleAddNewCategory} />
        </div>
    )
}
