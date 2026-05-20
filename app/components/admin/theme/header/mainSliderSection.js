import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Minus, PlusCircle, PlusIcon, Undo2, GripVertical, Film, Image as ImageIcon } from "lucide-react";
import { AdminContext } from "@/app/contexts/adminContexts";
import MediaLibrary from "@/app/components/mediaLibrary";
import TrashButton from "@/app/components/trashButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import SelectColor from "@/app/components/common/selectColor";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// MediaSelector Component (Generic component that handles both images and videos)
const MediaSelector = ({ row, mediaField, title, size, onMediaClick, onRemoveMedia, mediaType }) => {
    const isVideo = mediaType === 'video';
    
    return (
        <>
            <div
                onClick={() => !row[mediaField] && onMediaClick(row, mediaField)}
                className="w-6/12 border-dashed border-2 rounded-md h-auto flex items-center justify-center hover:border-primary cursor-pointer transition-all ease-in-out delay-75 max-w-6/12"
            >
                {row[mediaField] ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full">
                            {isVideo ? (
                                <video 
                                    src={row[mediaField]} 
                                    controls
                                    className="w-full h-auto" 
                                />
                            ) : (
                                <img
                                    src={row[mediaField]} 
                                    alt={`slider_${mediaField}_${row.id}`} 
                                    width={1000} 
                                    height={700} 
                                    className="h-auto" 
                                />
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem 
                                onClick={() => onRemoveMedia(row, mediaField)} 
                                className="text-sm cursor-pointer text-red-500 flex gap-1"
                            >
                                <Minus className="w-4 h-4" />
                                <span className="text-xs">删除</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-sm cursor-pointer flex gap-1" 
                                onClick={() => onMediaClick(row, mediaField)}
                            >
                                <Undo2 className="w-4 h-4" />
                                <span className="text-xs">替换{isVideo ? '视频' : '图片'}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="py-10 flex flex-col items-center justify-center gap-3">
                        {isVideo ? (
                            <Film className="w-5 h-5 text-muted-foreground" />
                        ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-xs text-muted-foreground">点击添加{title}</span>
                            {isVideo ? (
                                <span className="text-xs text-muted-foreground">推荐MP4、WebM格式</span>
                            ) : (
                                <span className="text-xs text-muted-foreground">图片尺寸: {size}</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <p className="text-xs text-muted-foreground">点击{isVideo ? '视频' : '图片'}进行删除或替换</p>
        </>
    );
};

// SortableItem Component
const SortableItem = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div className="flex gap-3 justify-between mb-5 border-b-2 pb-5">
                <div className="flex items-start gap-2">
                    <button 
                        className="mt-2 cursor-grab active:cursor-grabbing" 
                        {...listeners}
                    >
                        <GripVertical className="w-6 h-6 text-gray-400" />
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

// Main Component
export default function SiteMainSliderSection({ onChange }) {
    const { store } = useContext(AdminContext);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [openMediaModal, setOpenMediaModal] = useState({
        isOpen: false,
        row: {},
        mediaField: '',
        mediaType: 'image' // 'image' or 'video'
    });

    const [sliderItems, setSliderItems] = useState([
        { 
            id: 1, 
            image: false, 
            mobileImage: false,
            video: false,
            mobileVideo: false,
            mediaType: 'image', // 'image' or 'video'
            mainText: '', 
            tagline: '', 
            textPosition: 'left', 
            link: '', 
            buttonText: '', 
            descriptionTextColor: '' 
        }
    ]);

    const handleAddRow = () => {
        setSliderItems([...sliderItems, { 
            id: sliderItems.length + 1, 
            image: false, 
            mobileImage: false,
            video: false,
            mobileVideo: false,
            mediaType: 'image', // default to image
            mainText: '', 
            tagline: '', 
            textPosition: 'left', 
            link: '', 
            buttonText: '', 
            descriptionTextColor: '' 
        }]);
    };

    const handleRemoveRow = (id) => {
        const updatedRows = sliderItems
            .filter(row => row.id !== id)
            .map((row, index) => ({ ...row, id: index + 1 }));
        setSliderItems(updatedRows);
    };

    const handleInputChange = (id, field, value) => {
        const updatedRows = sliderItems.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        );
        setSliderItems(updatedRows);
    };

    const handleMediaTypeChange = (id, value) => {
        const updatedRows = sliderItems.map(row => {
            if (row.id === id) {
                // Reset all media fields when switching types for clean state
                return { 
                    ...row, 
                    mediaType: value,
                    // Reset fields based on newly selected type to avoid confusion
                    image: value === 'image' ? row.image : false,
                    mobileImage: value === 'image' ? row.mobileImage : false,
                    video: value === 'video' ? row.video : false,
                    mobileVideo: value === 'video' ? row.mobileVideo : false,
                };
            }
            return row;
        });
        setSliderItems(updatedRows);
    };

    const handlerMediaSelect = (media) => {
        const updatedRows = sliderItems.map(row => {
            if (row.id === openMediaModal.row.id) {
                return {
                    ...row,
                    [openMediaModal.mediaField]: media?.url
                };
            }
            return row;
        });

        setSliderItems(updatedRows);
        setOpenMediaModal({
            isOpen: false,
            row: {},
            mediaField: '',
            mediaType: 'image'
        });
    };

    const handlerRemoveMedia = (row, mediaField) => {
        const updatedRows = sliderItems.map(d => {
            if (d.id === row.id) {
                return {
                    ...d,
                    [mediaField]: false
                };
            }
            return d;
        });

        setSliderItems(updatedRows);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (active.id !== over.id) {
            setSliderItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                
                // First reorder the array
                const reorderedItems = arrayMove(items, oldIndex, newIndex);
                
                // Then update all IDs to match their new positions
                return reorderedItems.map((item, index) => ({
                    ...item,
                    id: index + 1
                }));
            });
        }
    };

    // Get appropriate field names based on media type
    const getMediaFields = (mediaType, isDesktop) => {
        if (mediaType === 'image') {
            return isDesktop ? 'image' : 'mobileImage';
        } else {
            return isDesktop ? 'video' : 'mobileVideo';
        }
    };

    useEffect(() => {
        onChange(sliderItems);
    }, [sliderItems, onChange]);

    useEffect(() => {
        if (store?.theme?.header) {
            
            
            setSliderItems(store.theme.header.slider);
        }
    }, [store]);

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sliderItems.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {sliderItems.map((row, i) => {
                        const isVideoMode = row.mediaType === 'video';
                        const desktopField = getMediaFields(row.mediaType, true);
                        const mobileField = getMediaFields(row.mediaType, false);
                        
                        return (
                            <SortableItem key={row.id} id={row.id}>
                                <div className="w-max space-y-4">
                                    <div>
                                        <label className="text-sm mb-3 block">媒体类型</label>
                                        <Tabs 
                                            defaultValue={row.mediaType || 'image'} 
                                            value={row.mediaType || 'image'}
                                            className="w-[400px] mb-4" 
                                            onValueChange={(e) => handleMediaTypeChange(row.id, e)}
                                        >
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="image" className="flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4" />
                                                    <span>图片</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="video" className="flex items-center gap-2">
                                                    <Film className="w-4 h-4" />
                                                    <span>视频</span>
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>

                                    <p className="text-sm">桌面端{isVideoMode ? '视频' : '图片'}</p>
                                    <MediaSelector 
                                        row={row} 
                                        mediaField={desktopField}
                                        title={`桌面端${isVideoMode ? '视频' : '图片'}`}
                                        size="1900x800 像素"
                                        mediaType={row.mediaType}
                                        onMediaClick={(row, mediaField) => setOpenMediaModal({
                                            isOpen: true,
                                            row,
                                            mediaField,
                                            mediaType: row.mediaType
                                        })}
                                        onRemoveMedia={handlerRemoveMedia}
                                    />
                                    
                                    <p className="text-sm">移动端{isVideoMode ? '视频' : '图片'}</p>
                                    <MediaSelector 
                                        row={row} 
                                        mediaField={mobileField}
                                        title={`移动端${isVideoMode ? '视频' : '图片'}`}
                                        size="800x1000 像素"
                                        mediaType={row.mediaType}
                                        onMediaClick={(row, mediaField) => setOpenMediaModal({
                                            isOpen: true,
                                            row,
                                            mediaField,
                                            mediaType: row.mediaType
                                        })}
                                        onRemoveMedia={handlerRemoveMedia}
                                    />

                                    {/* <Input
                                        type="text"
                                        placeholder="主标题"
                                        value={row.mainText}
                                        onChange={(e) => handleInputChange(row.id, 'mainText', e.target.value)}
                                    />
                                    
                                    <Textarea
                                        placeholder="标语"
                                        value={row.tagline}
                                        onChange={(e) => handleInputChange(row.id, 'tagline', e.target.value)}
                                    />
                                    
                                    <div>
                                        <p className="text-sm">描述文字颜色</p>
                                        <SelectColor 
                                            color={row.descriptionTextColor?.hex || '#000'} 
                                            onChange={(d) => handleInputChange(row.id, 'descriptionTextColor', d)}
                                        />
                                    </div> */}

                                    {/* <div>
                                        <label className="text-sm mb-3 block">横幅文字位置</label>
                                        <Tabs 
                                            defaultValue={row.textPosition} 
                                            className="w-[400px]" 
                                            onValueChange={(e) => handleInputChange(row.id, 'textPosition', e)}
                                        >
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="left">左侧</TabsTrigger>
                                                <TabsTrigger value="center">居中</TabsTrigger>
                                                <TabsTrigger value="right">右侧</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div> */}

                                    {/* <div>
                                        <label className="text-sm block">横幅按钮</label>
                                        <span className="text-xs text-muted-foreground mb-3 block">
                                            留空则不在横幅中显示按钮
                                        </span>
                                        <div className="flex items-center gap-3 mb-3">
                                            <Input
                                                type="text"
                                                placeholder="按钮链接"
                                                value={row.link || ''}
                                                onChange={(e) => handleInputChange(row.id, 'link', e.target.value)}
                                            />
                                            <Input
                                                type="text"
                                                placeholder="按钮文字"
                                                value={row.buttonText || ''}
                                                onChange={(e) => handleInputChange(row.id, 'buttonText', e.target.value)}
                                            />
                                        </div>
                                    </div> */}
                                </div>
                                <div className="flex flex-col gap-3 top-10">
                                    <TrashButton
                                        title="您确定吗？"
                                        content="您确定要删除这个轮播图吗？"
                                        onContinue={() => handleRemoveRow(row.id)}
                                    />
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold">
                                        {i + 1}
                                    </div>
                                </div>
                            </SortableItem>
                        );
                    })}
                </SortableContext>

                <div 
                    onClick={handleAddRow} 
                    className="flex flex-col gap-3 p-5 border-[1px] border-dashed border-gray-300 rounded-lg w-full items-center justify-center hover:border-gray-400 cursor-pointer"
                >
                    <PlusCircle className="w-10 h-10 text-muted-foreground" strokeWidth={0.8} />
                    <span>添加新轮播图</span>
                </div>
            </DndContext>

            <Dialog 
                open={openMediaModal?.isOpen} 
                onOpenChange={() => setOpenMediaModal({ isOpen: false, row: {}, mediaField: '', mediaType: 'image' })}
            >
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            选择{openMediaModal.mediaType === 'video' ? '视频' : '图片'}
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground mb-3 block">
                            您可以从媒体库中选择{openMediaModal.mediaType === 'video' ? '视频' : '图片'}，或直接从本地电脑上传。
                        </p>
                    </DialogHeader>
                    <MediaLibrary 
                        selectedMedia={handlerMediaSelect} 
                        mediaType={openMediaModal.mediaType}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}