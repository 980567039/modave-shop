import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus, Plus, PlusCircle, Trash2 } from 'lucide-react';
import TrashButton from '@/app/components/trashButton';

const initialItem = {
    mainMenuTitle: '',
    menuItems: [{ url: '', label: '' }]
};

export default function FooterMenus({
    onChange,
    data
}) {
    const [items, setItems] = useState([{ id: 1, ...initialItem }]);

    const handleRemoveRow = useCallback((id) => {
        setItems(prevItems => prevItems.filter(row => row.id !== id).map((row, index) => ({ ...row, id: index + 1 })));
    }, []);

    const handleInputChange = useCallback((id, field, value) => {
        setItems(prevItems => prevItems.map(row => row.id === id ? { ...row, [field]: value } : row));
    }, []);

    const handleInputChangeMenu = useCallback((id, index, field, value) => {
        setItems(prevItems => prevItems.map(row => {
            if (row.id === id) {
                const newMenuItems = [...row.menuItems];
                newMenuItems[index] = { ...newMenuItems[index], [field]: value };
                return { ...row, menuItems: newMenuItems };
            }
            return row;
        }));
    }, []);

    const handleAddMenuLink = useCallback((id) => {
        setItems(prevItems => prevItems.map(row => {
            if (row.id === id) {
                return { ...row, menuItems: [...row.menuItems, { url: '', label: '' }] };
            }
            return row;
        }));
    }, []);

    const handleRemoveMenuItem = useCallback((menuId, itemIndex) => {
        setItems(prevItems => prevItems.map(row => {
            if (row.id === menuId) {
                const newMenuItems = row.menuItems.filter((_, index) => index !== itemIndex);
                return { ...row, menuItems: newMenuItems };
            }
            return row;
        }));
    }, []);

    const handleAddRow = () => {
        const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        setItems(prevItems => [...prevItems, { id: newId, ...initialItem }]);
    };

    useEffect(() => {
        onChange?.(items);
    }, [items]);


    useEffect(() => {
        if (data && data?.footerMenus) {
            setItems(data?.footerMenus)
        }
    }, [data]);

    return (
        <div>
            {items.map((row) => (
                <div key={row.id} className="border-b-2 pb-3 mb-3">
                    <div className="flex items-start justify-between mb-2">
                        <Input
                            type="text"
                            placeholder="主标题"
                            value={row.mainMenuTitle}
                            onChange={(e) => handleInputChange(row.id, 'mainMenuTitle', e.target.value)}
                            className="w-full mr-2"
                        />
                        <TrashButton
                            onContinue={() => handleRemoveRow(row.id)}
                            title="您确定吗？"
                            content="您确定要删除这个菜单吗？"
                        />
                    </div>
                    {row.menuItems.map((menu, index) => (
                        <div key={index} className="flex items-center gap-3 mb-2 pl-5 w-10/12">
                            <Input
                                type="text"
                                placeholder="菜单链接"
                                value={menu.url}
                                onChange={(e) => handleInputChangeMenu(row.id, index, 'url', e.target.value)}
                            />
                            <Input
                                type="text"
                                placeholder="菜单标签"
                                value={menu.label}
                                onChange={(e) => handleInputChangeMenu(row.id, index, 'label', e.target.value)}
                            />
                            <TrashButton
                                onContinue={() => handleRemoveMenuItem(row.id, index)}
                                title="您确定吗？"
                                content="您确定要删除这个菜单项吗？"
                                customIcon={<Minus className='text-red-500 w-4 h-4 block' />}
                            />
                        </div>
                    ))}
                    <div className='pl-5'>
                        <Button onClick={() => handleAddMenuLink(row.id)} className="mt-2" variant="outline">
                            <Plus className='w-4 h-4 mr-2' />添加新菜单链接
                        </Button>
                    </div>
                </div>
            ))}

            {items.length < 4 && <div
                onClick={handleAddRow}
                className="flex flex-col gap-3 p-5 border-[1px] border-dashed border-gray-300 rounded-lg w-full items-center justify-center hover:border-gray-400 cursor-pointer mt-4"
            >
                <PlusCircle className="w-10 h-10 text-muted-foreground" strokeWidth={0.8} />
                <span>添加新菜单</span>
            </div>}
        </div>
    );
}