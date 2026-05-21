"use client";

import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Plus,
    Minus,
    PlusCircle,
    ArrowUpRight,
    Image as ImageIcon,
    ChevronsUpDown,
    Check,
    LoaderCircle,
    Undo2,
    ImagePlus
} from 'lucide-react';

import { cn } from "@/lib/utils";
import TrashButton from '@/app/components/trashButton';
import useSubmitThemeForm from '@/app/hooks/useSubmitThemeForm';
import { AdminContext } from '@/app/contexts/adminContexts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MediaLibrary from '@/app/components/mediaLibrary';

const menuTypes = [
    { label: "简单链接", value: "simple" },
    { label: "嵌套菜单", value: "nested" },
];

const initialMenuItem = {
    label: '',
    url: '',
    type: 'simple',
    imageUrl: '',
    bigTitle: '',
    subMenus: []
};

const initialSubMenuItem = {
    label: '',
    url: '',
    imageUrl: '' // 为子菜单项添加imageUrl字段
};

export default function NavigationMenuManager({ onChange, data }) {
    const { store, setStore } = useContext(AdminContext);
    const [items, setItems] = useState([{ id: 1, ...initialMenuItem }]);
    const [openStates, setOpenStates] = useState({});
    const { isLoading, handleSubmitForm } = useSubmitThemeForm();
    const [openImageModal, setOpenImageModal] = useState({ isOpen: false, rowId: null, subMenuIndex: null });


    const handleRemoveRow = useCallback((id) => {
        setItems(prevItems =>
            prevItems
                .filter(row => row.id !== id)
                .map((row, index) => ({ ...row, id: index + 1 }))
        );
    }, []);

    const handleInputChange = useCallback((id, field, value) => {
        setItems(prevItems => prevItems.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    }, []);

    const handleTypeChange = useCallback((id, value) => {
        setItems(prevItems => prevItems.map(row =>
            row.id === id ? {
                ...row,
                type: value,
                subMenus: value === 'nested' ? [{ ...initialSubMenuItem }] : [],
                imageUrl: value === 'nested' ? row.imageUrl : '',
                bigTitle: value === 'nested' ? row.bigTitle : ''
            } : row
        ));
        setOpenStates(prev => ({ ...prev, [id]: false }));
    }, []);

    const handleSubMenuChange = useCallback((menuId, index, field, value) => {
        setItems(prevItems => prevItems.map(row => {
            if (row.id === menuId) {
                const newSubMenus = [...row.subMenus];
                newSubMenus[index] = { ...newSubMenus[index], [field]: value };
                return { ...row, subMenus: newSubMenus };
            }
            return row;
        }));
    }, []);

    const handleAddSubMenu = useCallback((id) => {
        setItems(prevItems => prevItems.map(row => {
            if (row.id === id) {
                return {
                    ...row,
                    subMenus: [...row.subMenus, { ...initialSubMenuItem }]
                };
            }
            return row;
        }));
    }, []);

    const handleRemoveSubMenu = useCallback((menuId, subMenuIndex) => {
        setItems(prevItems => prevItems.map(row => {
            if (row.id === menuId) {
                const newSubMenus = row.subMenus.filter((_, index) => index !== subMenuIndex);
                return { ...row, subMenus: newSubMenus };
            }
            return row;
        }));
    }, []);

    const handleAddRow = () => {
        const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        setItems(prevItems => [...prevItems, { id: newId, ...initialMenuItem }]);
    };

    const togglePopover = (id, value) => {
        setOpenStates(prev => ({ ...prev, [id]: value }));
    };

    const handleImageAction = useCallback((action, rowId, subMenuIndex = null, image = null) => {
        if (subMenuIndex !== null) {
            // 处理子菜单图片操作
            setItems(prevItems => prevItems.map(row => {
                if (row.id === rowId) {
                    const newSubMenus = [...row.subMenus];
                    newSubMenus[subMenuIndex] = { 
                        ...newSubMenus[subMenuIndex], 
                        imageUrl: action === 'remove' ? '' : (image?.url || newSubMenus[subMenuIndex].imageUrl) 
                    };
                    return { ...row, subMenus: newSubMenus };
                }
                return row;
            }));
        } else {
            // 处理主菜单图片操作
            setItems(prevItems => prevItems.map(row =>
                row.id === rowId ? { ...row, imageUrl: action === 'remove' ? '' : (image?.url || row.imageUrl) } : row
            ));
        }
        
        setOpenImageModal({ isOpen: false, rowId: null, subMenuIndex: null });
    }, []);


    useEffect(() => {
        if (store?.theme?.mainNavigation) {
            setItems(store.theme.mainNavigation);
        }
    }, [store?.theme?.mainNavigation]);

    const handlerSave = async () => {
        const payload = {
            mainNavigation: items,
            storeId: store?._id,
        };


        handleSubmitForm(
            'admin/store/theme', // 动态URL
            'POST', // HTTP方法
            payload, // 动态载荷
            (data) => {
                setStore((prevState) => ({
                    ...prevState,
                    theme: data,
                }));
            }
        );

    };

    const ImageSelector = ({ row, small = false, subMenuIndex = null }) => (
        <div
            onClick={() => setOpenImageModal({ 
                isOpen: true, 
                rowId: row.id, 
                subMenuIndex: subMenuIndex 
            })}
            className={`${small ? 'w-12 h-12' : 'w-[200px] h-[200px]'} relative overflow-hidden border-dashed border-2 rounded-md flex items-center justify-center hover:border-primary cursor-pointer transition-all ease-in-out delay-75`}
        >
            {(subMenuIndex !== null ? row.subMenus[subMenuIndex].imageUrl : row.imageUrl) ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className='absolute left-0 top-0 w-full h-full object-cover'>
                        <img
                            src={subMenuIndex !== null ? row.subMenus[subMenuIndex].imageUrl : row.imageUrl}
                            alt={`${subMenuIndex !== null ? 'submenu' : 'menu'}_img_${row.id}`}
                            width={small ? 48 : 150}
                            height={small ? 48 : 150}
                            placeholder="blur"
                            className='w-full h-full absolute left-0 top-0 object-cover'
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAbEAADAAMBAQAAAAAAAAAAAAABAgMABBEhMf/EABUBAQEAAAAAAAAAAAAAAAAAAAID/8QAFREBAQAAAAAAAAAAAAAAAAAAAQD/2gAMAwEAAhEDEQA/ALTDacXxKe+ZjhKSpamNXoDTRhAOEXbDWzSHH//Z"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem 
                            onClick={() => handleImageAction('remove', row.id, subMenuIndex)} 
                            className="text-sm cursor-pointer text-red-500 flex gap-1"
                        >
                            <Minus className='w-4 h-4' />
                            <span className='text-xs'>移除</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => setOpenImageModal({ 
                                isOpen: true, 
                                rowId: row.id, 
                                subMenuIndex: subMenuIndex 
                            })} 
                            className="text-sm cursor-pointer flex gap-1"
                        >
                            <Undo2 className='w-4 h-4' />
                            <span className='text-xs'>替换图片</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className='flex flex-col items-center justify-center'>
                    <ImagePlus className={`${small ? 'w-3 h-3' : 'w-5 h-5'} text-muted-foreground`} strokeWidth={1} />
                    <p className={`${small ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                        {small ? '图标' : '菜单图片'}
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-3">
            <div>
                <h2 className="font-semibold text-xl">主导航</h2>
                <p className="text-muted-foreground text-sm">网站的所有主导航自定义将在此集中管理。</p>
            </div>
            {items && items.map((item) => (
                <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4">
                                <Input
                                    type="text"
                                    placeholder="菜单标签"
                                    value={item.label}
                                    onChange={(e) => handleInputChange(item.id, 'label', e.target.value)}
                                    className="w-1/3"
                                />
                                <Input
                                    type="text"
                                    placeholder="菜单URL"
                                    value={item.url}
                                    onChange={(e) => handleInputChange(item.id, 'url', e.target.value)}
                                    className="w-1/3"
                                />
                                <Popover
                                    open={openStates[item.id]}
                                    onOpenChange={(value) => togglePopover(item.id, value)}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openStates[item.id]}
                                            className="w-[200px] justify-between"
                                        >
                                            {item.type ?
                                                menuTypes.find((type) => type.value === item.type)?.label
                                                : "选择菜单类型..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="搜索菜单类型..." />
                                            <CommandList>
                                                <CommandEmpty>未找到类型。</CommandEmpty>
                                                <CommandGroup>
                                                    {menuTypes.map((type) => (
                                                        <CommandItem
                                                            key={type.value}
                                                            value={type.value}
                                                            onSelect={(currentValue) => {
                                                                handleTypeChange(item.id, currentValue);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    item.type === type.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {type.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {item.type === 'nested' && (
                                <div className="pl-8 space-y-4 border-l-2 border-gray-100">
                                    <div className="space-y-4 flex gap-3 items-start">
                                        <ImageSelector row={item} />

                                        <Input
                                            type="text"
                                            placeholder="菜单大标题"
                                            value={item.bigTitle}
                                            onChange={(e) => handleInputChange(item.id, 'bigTitle', e.target.value)}
                                            className="w-2/3 mt-0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className='flex flex-col gap-3'>
                                            <label className="text-xs font-medium text-muted-foreground uppercase">子菜单项目</label>
                                            {item.subMenus.map((subMenu, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <ImageSelector 
                                                        row={item} 
                                                        small={true} 
                                                        subMenuIndex={index} 
                                                    />
                                                    <Input
                                                        type="text"
                                                        placeholder="子菜单标签"
                                                        value={subMenu.label}
                                                        onChange={(e) => handleSubMenuChange(item.id, index, 'label', e.target.value)}
                                                        className="w-1/3"
                                                    />
                                                    <Input
                                                        type="text"
                                                        placeholder="子菜单URL"
                                                        value={subMenu.url}
                                                        onChange={(e) => handleSubMenuChange(item.id, index, 'url', e.target.value)}
                                                        className="w-1/3"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveSubMenu(item.id, index)}
                                                    >
                                                        <Minus className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAddSubMenu(item.id)}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                添加子菜单项
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <TrashButton
                            onContinue={() => handleRemoveRow(item.id)}
                            title="删除菜单项"
                            content="您确定要删除此菜单项及其所有子菜单吗？"
                        />
                    </div>
                </Card>
            ))}

            {items && items.length < 8 && (
                <Button
                    variant="outline"
                    className="w-full py-8"
                    onClick={handleAddRow}
                >
                    <PlusCircle className="w-6 h-6 mr-2" />
                    添加新菜单项
                </Button>
            )}


            <div className="flex justify-end">
                <div className="flex justify-end ">
                    <Button type="button" onClick={handlerSave} disabled={isLoading}>
                        {isLoading ? <>
                            <LoaderCircle className='w-5 h-5 animate-spin mr-1' />
                            保存中
                        </> : <>
                            保存
                        </>}
                    </Button>
                </div>
            </div>

            <Dialog open={openImageModal.isOpen} onOpenChange={() => setOpenImageModal({ isOpen: false, rowId: null, subMenuIndex: null })}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择图片</DialogTitle>
                        <p className='text-xs text-muted-foreground mb-3 block'>
                            {openImageModal.subMenuIndex !== null 
                                ? '为此子菜单项选择一个小图标' 
                                : '您可以从媒体库中选择图片或直接从本地电脑上传。'}
                        </p>
                    </DialogHeader>
                    <MediaLibrary 
                        selectedMedia={(image) => handleImageAction(
                            'select', 
                            openImageModal.rowId, 
                            openImageModal.subMenuIndex, 
                            image
                        )} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
