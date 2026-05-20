"use client";
import MediaLibrary from "@/app/components/mediaLibrary";
import TrashButton from "@/app/components/trashButton";
import { AdminContext } from "@/app/contexts/adminContexts";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Minus, PlusCircle, PlusIcon, Undo2, Smartphone, Monitor } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';

export default function SiteSizeChart({ onChange, max = null, hide = null, imageSize = null, mobileImageSize = null, addNewText = null, findBy = null, data }) {
    const { store } = useContext(AdminContext);

    const [openImageModal, setOpenImageModal] = useState({
        isOpen: false,
        row: {},
        type: 'desktop' // 'desktop' or 'mobile'
    });

    const [sizeChartItems, setSizeChartItems] = useState([
        { id: 1, image: false, mobileImage: false, title: '', uniqueId: uuidv4().substring(0, 8) || '' }
    ]);

    const handleAddRow = () => {
        if (max && max - 1 < sizeChartItems.length) {
            return false;
        }
        setSizeChartItems([...sizeChartItems, { id: sizeChartItems.length + 1, image: false, mobileImage: false, title: '', uniqueId: uuidv4().substring(0, 8) || '' }]);
    };

    const handleRemoveRow = (id) => {
        const updatedRows = sizeChartItems
            .filter(row => row.id !== id)
            .map((row, index) => ({ ...row, id: index + 1 }));
        setSizeChartItems(updatedRows);
    };

    const handleInputChange = (id, field, value) => {
        const updatedRows = sizeChartItems.map(row =>
            row.id === id
                ? { ...row, [field]: value }
                : (field === 'isMain' && value)
                    ? { ...row, isMain: false }
                    : row
        );
        setSizeChartItems(updatedRows);
    };

    const handlerImageSelect = (image) => {
        const updatedRows = sizeChartItems.map(row => {
            if (row.id === openImageModal.row.id) {
                return {
                    ...row,
                    [openImageModal.type === 'desktop' ? 'image' : 'mobileImage']: image?.url
                };
            }
            return row;
        });

        setSizeChartItems(updatedRows);
        setOpenImageModal({
            isOpen: false,
            row: {},
            type: 'desktop'
        });
    };

    const handlerRemoveImage = (row, type) => {
        const updatedRows = sizeChartItems.map(d => {
            if (d.id === row.id) {
                return {
                    ...d,
                    [type === 'desktop' ? 'image' : 'mobileImage']: false
                };
            }
            return d;
        });

        setSizeChartItems(updatedRows);
    };

    useEffect(() => {
        onChange(sizeChartItems);
    }, [sizeChartItems]);

    useEffect(() => {
        if (data && data?.length > 0) {
            setSizeChartItems(data);
        }
    }, [data]);

    const ImageSelector = ({ row, type }) => {
        const isDesktop = type === 'desktop';
        const image = isDesktop ? row.image : row.mobileImage;
        const defaultSize = isDesktop ? (imageSize || '1000x1000') : (mobileImageSize || '500x800');

        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    {isDesktop ? (
                        <>
                            <Monitor className="w-4 h-4" />
                            <span>桌面端图片</span>
                        </>
                    ) : (
                        <>
                            <Smartphone className="w-4 h-4" />
                            <span>移动端图片</span>
                        </>
                    )}
                </div>
                <div 
                    onClick={() => !image ? setOpenImageModal({
                        isOpen: true,
                        row,
                        type
                    }) : {}} 
                    className="w-full border-dashed border-2 rounded-md flex items-center justify-center hover:border-primary cursor-pointer transition-all ease-in-out delay-75"
                >
                    {image ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full">
                                <img src={image} alt={`${type}_slider_${row.id}`} width={1000} height={700} className="w-full h-auto" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handlerRemoveImage(row, type)} className="text-sm cursor-pointer text-red-500 flex gap-1">
                                    <Minus className="w-4 h-4" />
                                    <span className="text-xs">删除</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-sm cursor-pointer flex gap-1" onClick={() => setOpenImageModal({
                                    isOpen: true,
                                    row,
                                    type
                                })}>
                                    <Undo2 className="w-4 h-4" />
                                    <span className="text-xs">替换图片</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <AspectRatio>
                            <div className="py-10 flex flex-col items-center justify-center gap-3 h-full">
                                <div className="flex items-center gap-2">
                                    <PlusIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-xs text-muted-foreground">点击添加{type === 'desktop' ? '桌面端' : '移动端'}图片</span>
                                    <span className="text-xs text-muted-foreground">图片尺寸: {defaultSize} 像素</span>
                                </div>
                            </div>
                        </AspectRatio>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {sizeChartItems && sizeChartItems.length > 0 && sizeChartItems.map((row, i) => (
                <div key={row.id} className="flex gap-3 justify-between mb-5 border-b-2 pb-5">
                    <div className="flex flex-col w-full space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <ImageSelector row={row} type="desktop" />
                            </div>
                            <div className="col-span-1">
                                <ImageSelector row={row} type="mobile" />
                            </div>
                        </div>
                        
                        {(!hide || !hide.includes("title")) && (
                            <div className="w-full">
                                <Input
                                    type="text"
                                    placeholder="标题"
                                    value={row.title}
                                    onChange={(e) => handleInputChange(row.id, 'title', e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-3 top-10">
                        <TrashButton
                            title="您确定吗？"
                            content="您确定要删除这个项目吗？"
                            onContinue={() => handleRemoveRow(row.id)}
                        />
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold">
                            {i + 1}
                        </div>
                    </div>
                </div>
            ))}
            
            {(!max || sizeChartItems.length < max) && (
                <div 
                    onClick={handleAddRow} 
                    className="flex flex-col gap-3 p-5 border-[1px] border-dashed border-gray-300 rounded-lg w-full items-center justify-center hover:border-gray-400 cursor-pointer"
                >
                    <PlusCircle className="w-10 h-10 text-muted-foreground" strokeWidth={0.8} />
                    <span>添加新{addNewText || '分类'}</span>
                </div>
            )}

            <Dialog 
                open={openImageModal?.isOpen} 
                onOpenChange={() => setOpenImageModal({
                    isOpen: false,
                    row: {},
                    type: 'desktop'
                })}
            >
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>选择{openImageModal.type === 'desktop' ? '桌面端' : '移动端'}{addNewText || '分类'}图片</DialogTitle>
                        <p className="text-xs text-muted-foreground mb-3 block">
                            您可以从媒体库中选择图片，或直接从本地电脑上传。
                        </p>
                    </DialogHeader>
                    <MediaLibrary selectedMedia={handlerImageSelect} />
                </DialogContent>
            </Dialog>
        </>
    );
}