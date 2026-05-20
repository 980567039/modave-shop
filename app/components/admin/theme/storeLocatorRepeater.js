"use client";

import React, { useContext, useEffect, useState } from 'react'
import TrashButton from '../../trashButton';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdminContext } from '@/app/contexts/adminContexts';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function StoreLocatorRepeater({ onChange }) {
    const { store } = useContext(AdminContext);

    const [locationItems, setLocationItems] = useState([
        {
            id: 1,
            locationName: '',
            address: '',
            emailAddress: '',
            contactNumber: '',
            isPickUpLocation: true,
        }
    ]);

    const handleAddRow = () => {
        setLocationItems([...locationItems, {
            id: locationItems.length + 1,
            locationName: '',
            address: '',
            emailAddress: '',
            contactNumber: '',
            isPickUpLocation: true,
        }]);
    };

    const handleRemoveRow = (id) => {
        const updatedRows = locationItems
        .filter(row => row.id !== id)
        .map((row, index) => ({ ...row, id: index + 1 }));

        setLocationItems(updatedRows);
    };

    const handleInputChange = (id, field, value) => {
        const updatedRows = locationItems.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        );
        setLocationItems(updatedRows);
    };

    useEffect(() => {
        onChange(locationItems);
    }, [locationItems]);


    useEffect(() => {
        if (store && store?.theme && store?.theme?.storeLocations) {
            setLocationItems(store?.theme?.storeLocations?.locations);
        }
    }, [store]);

    return (
        <div>
            {locationItems && locationItems.length > 0 && locationItems.map((row, i) => (
                <div key={row.id.toString()} className='flex gap-3 justify-between mb-5 border-b-2 pb-5'>
                    <div className='w-full space-y-3'>
                        <Input
                            type="text"
                            placeholder="门店名称"
                            value={row.locationName}
                            onChange={(e) => handleInputChange(row.id, 'locationName', e.target.value)}
                        />
                        <Textarea
                            placeholder="地址"
                            value={row.address}
                            onChange={(e) => handleInputChange(row.id, 'address', e.target.value)}
                        />
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Input
                                    type="email"
                                    placeholder="电子邮箱"
                                    value={row.emailAddress}
                                    onChange={(e) => handleInputChange(row.id, 'emailAddress', e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="电话"
                                    value={row.contactNumber}
                                    onChange={(e) => handleInputChange(row.id, 'contactNumber', e.target.value)}
                                />
                            </div>
                            
                            {/* Pickup Location Checkbox */}
                            <div className="flex items-center space-x-2 mt-2">
                                <Checkbox 
                                    id={`pickup-${row.id}`}
                                    checked={row.isPickUpLocation}
                                    onCheckedChange={(checked) => 
                                        handleInputChange(row.id, 'isPickUpLocation', checked)
                                    }
                                />
                                <Label 
                                    htmlFor={`pickup-${row.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    是自提点
                                </Label>
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
            <div onClick={handleAddRow} className="flex flex-col gap-3 p-5 border-[1px] border-dashed border-gray-300 rounded-lg w-full items-center justify-center hover:border-gray-400 cursor-pointer">
                <PlusCircle className='w-10 h-10 text-muted-foreground' strokeWidth={0.8} />
                <span>添加新门店</span>
            </div>
        </div>
    )
}