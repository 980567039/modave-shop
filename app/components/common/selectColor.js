import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PaintBucket } from 'lucide-react'
import React from 'react'
import { ChromePicker } from 'react-color'

export default function SelectColor({
    color,
    onChange
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center w-fit'>
                <div className='flex gap-2 items-center mt-3 '>
                    <div style={{ backgroundColor: color }} className={` p-1 w-10 h-10 rounded-full border-[1px] flex items-center justify-center`}>
                        {color === "" && <PaintBucket className='w-5 h-5' />}
                    </div>

                    <p className='text-xs text-muted-foreground'>Click icon to select color</p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                <ChromePicker
                    color={color}
                    onChangeComplete={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
