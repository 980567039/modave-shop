// DraggableSubmenu.js
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus, GripVertical } from 'lucide-react';

const SortableSubmenuItem = ({ submenuId, subMenu, onInputChange, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ 
        id: submenuId,
        data: {
            type: 'submenu',
            subMenu
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        zIndex: isDragging ? 1 : 0
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style}
            className="flex items-center gap-3 bg-white p-2 rounded-md border border-gray-100"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab hover:text-primary focus:outline-none touch-none"
                type="button"
            >
                <GripVertical className="w-4 h-4" />
            </button>
            <Input
                type="text"
                placeholder="子菜单标签"
                value={subMenu.label}
                onChange={(e) => onInputChange(submenuId, 'label', e.target.value)}
                className="w-1/3"
            />
            <Input
                type="text"
                placeholder="子菜单URL"
                value={subMenu.url}
                onChange={(e) => onInputChange(submenuId, 'url', e.target.value)}
                className="w-1/3"
            />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(submenuId)}
                type="button"
            >
                <Minus className="w-4 h-4 text-red-500" />
            </Button>
        </div>
    );
};

const DraggableSubmenu = ({ menuId, subMenus, onSubMenuChange, onRemoveSubMenu, onReorder }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (active.id !== over.id) {
            const oldIndex = subMenus.findIndex(item => item.id === active.id);
            const newIndex = subMenus.findIndex(item => item.id === over.id);
            
            const newSubMenus = arrayMove([...subMenus], oldIndex, newIndex);
            onReorder(menuId, newSubMenus);
        }
    };

    const sortableIds = subMenus.map(item => item.id);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={sortableIds}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {subMenus.map((subMenu) => (
                        <SortableSubmenuItem
                            key={subMenu.id}
                            submenuId={subMenu.id}
                            subMenu={subMenu}
                            onInputChange={(id, field, value) => {
                                const index = subMenus.findIndex(item => item.id === id);
                                const updatedSubMenus = subMenus.map((item, i) => 
                                    i === index ? { ...item, [field]: value } : item
                                );
                                onSubMenuChange(menuId, index, field, value);
                            }}
                            onRemove={(id) => {
                                const index = subMenus.findIndex(item => item.id === id);
                                onRemoveSubMenu(menuId, index);
                            }}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default DraggableSubmenu;