"use client";
import MediaLibrary from "@/app/components/mediaLibrary";
import TrashButton from "@/app/components/trashButton";
import { AdminContext } from "@/app/contexts/adminContexts";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Minus, PlusCircle, PlusIcon, Trash, Undo2 } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react"

export default function CategoriesSelection({ onChange, max = null, hide = null, imageSize = null, addNewText = null, findBy = null }) {
    const { store } = useContext(AdminContext);

    const [openImageModal, setOpenImageModal] = useState({
        isOpen: false,
        row: {}
    });

    const [categoryItems, setCategoryItems] = useState([
        { id: 1, image: false, mainTitle: '', isMain: false, link: '', linkText: '', movingText: '' }
    ]);

    const handleAddRow = () => {
        if (max && max - 1 < categoryItems.length) {
            return false;
        }
        setCategoryItems([...categoryItems, { id: categoryItems.length + 1, image: false, mainTitle: '', isMain: false, link: '', linkText: '', movingText: '' }]);
    };

    const handleRemoveRow = (id) => {
        const updatedRows = categoryItems
            .filter(row => row.id !== id)
            .map((row, index) => ({ ...row, id: index + 1 }));
        setCategoryItems(updatedRows);
    };

    const handleInputChange = (id, field, value) => {
        const updatedRows = categoryItems.map(row =>
            row.id === id
                ? { ...row, [field]: value }
                : (field === 'isMain' && value)
                    ? { ...row, isMain: false }
                    : row
        );
        setCategoryItems(updatedRows);
    };

    const handlerImageSelect = (image) => {
        const updatedRows = categoryItems.map(row => {
            if (row.id === openImageModal.row.id) {
                return {
                    ...row,
                    image: image?.url
                };
            }
            return row;

        });

        setCategoryItems(updatedRows);
        setOpenImageModal({
            isOpen: false,
            row: {}
        })
    }

    const handlerRemoveImage = (row) => {
        const updatedRows = categoryItems.map(d => {
            if (d.id === row.id) {
                return {
                    ...d,
                    image: false
                };
            }
            return d;

        });

        setCategoryItems(updatedRows);
    }

    const filterKeys = (array, keysToRemove) => {
        return array?.map(item => {
            return Object.keys(item).reduce((newItem, key) => {
                if (!keysToRemove.includes(key)) {
                    newItem[key] = item[key];
                }
                return newItem;
            }, {});
        });
    };


    useEffect(() => {
        if (hide && Array.isArray(hide) && hide.length > 0) {
            const getFilter = filterKeys(categoryItems, hide);
            onChange(getFilter);
        } else {
            onChange(categoryItems);
        }

    }, [categoryItems]);

    useEffect(() => {

        if (store && store?.theme && store?.theme?.[findBy]) {
            let items;

            if(findBy === "featuredCollection" || findBy === "shopByCategories"){
                items = store?.theme?.[findBy]?.items;
            }else{
                items = store?.theme?.[findBy];   
            }
            setCategoryItems(items || []);
        }
    }, [store]);


    return (
        <>
            {categoryItems && categoryItems.length > 0 && categoryItems.map((row, i) => (
                <div key={row.id} className='flex gap-3 justify-between mb-5 border-b-2 pb-5'>
                    <div className='flex items-start gap-3 w-full space-y-4'>
                        <div onClick={() => !row?.image ? setOpenImageModal({
                            isOpen: true,
                            row,
                        }) : {}} className='w-[300px]  border-dashed border-2 rounded-md flex items-center justify-center hover:border-primary cursor-pointer transition-all ease-in-out delay-75'>
                            {row?.image ? <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full">
                                        <img src={row?.image} alt={`slider_${row.id}`} width={1000} height={700} className="w-full h-auto" />
                                    </DropdownMenuTrigger>
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
                            </> :
                                <AspectRatio ratio={1 / 1}>
                                    <div className="py-10 flex flex-col items-center justify-center gap-3 h-full">
                                        <div className="flex items-center gap-5">
                                            <PlusIcon className='w-5 h-5 text-muted-foreground' />
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-xs text-muted-foreground">点击添加图片</span>
                                            <span className="text-xs text-muted-foreground">图片尺寸: {imageSize ? imageSize : '1000x1000'} 像素</span>
                                        </div>
                                    </div>
                                </AspectRatio>
                            }
                        </div>
                        <div className="m-0 flex flex-col gap-3">
                            {(!hide || !hide.includes("mainTitle")) && <div className='w-full'>
                                <Input
                                    type="text"
                                    placeholder="主标题"
                                    value={row.mainTitle}
                                    onChange={(e) => handleInputChange(row.id, 'mainTitle', e.target.value)}
                                />
                            </div>}
                            {(!hide || !hide.includes("isMain")) && <div className='w-full flex flex-col gap-3'>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={row.isMain}
                                        id={`switch_is_default_${row.id}`}
                                        onCheckedChange={(checked) => handleInputChange(row.id, 'isMain', checked)}
                                    />
                                    <Label htmlFor={`switch_is_default_${row.id}`}>设为主要分类</Label>
                                </div>

                                {row.isMain && <Input
                                    type="text"
                                    placeholder="滚动文本"
                                    value={row.movingText}
                                    onChange={(e) => handleInputChange(row.id, 'movingText', e.target.value)}
                                />}
                            </div>}
                            <div>
                                <label className="block text-sm font-semibold mb-3">阅读更多链接</label>
                                <div className="flex items-center gap-3 mb-3">
                                    <Input
                                        type="text"
                                        placeholder="链接URL"
                                        value={row.link}
                                        onChange={(e) => handleInputChange(row.id, 'link', e.target.value)}
                                    />
                                    {(!hide || !hide.includes("linkText")) && <Input
                                        type="text"
                                        placeholder="链接文本"
                                        value={row.linkText}
                                        onChange={(e) => handleInputChange(row.id, 'linkText', e.target.value)}
                                    />}
                                </div>

                            </div>
                        </div>


                    </div>
                    <div className='flex flex-col gap-3 top-10'>
                        <TrashButton
                            title="您确定吗？"
                            content="您确定要删除此项目吗？"
                            onContinue={() => {
                                handleRemoveRow(row.id)
                            }}
                        />
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold">{i + 1}</div>
                    </div>
                </div>
            ))}
            {(!max || categoryItems.length < max) && (
                <div onClick={handleAddRow} className="flex flex-col gap-3 p-5 border-[1px] border-dashed border-gray-300 rounded-lg w-full items-center justify-center hover:border-gray-400 cursor-pointer">
                    <PlusCircle className='w-10 h-10 text-muted-foreground' strokeWidth={0.8} />
                    <span>添加新{addNewText || '分类'}</span>
                </div>
            )}


            <Dialog open={openImageModal?.isOpen} onOpenChange={() => setOpenImageModal({
                isOpen: false,
                row: {},
            })}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择{addNewText || '分类'}图片</DialogTitle>
                        <p className='text-xs text-muted-foreground mb-3 block'>您可以从媒体库中选择图片或直接从本地电脑上传。</p>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={handlerImageSelect} />
                </DialogContent>
            </Dialog>
        </>
    )
}
