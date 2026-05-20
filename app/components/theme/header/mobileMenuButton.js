import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import React, { useState } from 'react'
import MainMenu from './mainMenu'
import NeedHelp from '../common/needHelp'

export default function MobileMenuButton({
    isScroll,
    data
}) {
    const [openSheet, setOpenSheet] = useState(false);

    const onClickHandler  = () => {
        setOpenSheet(false);
    };    

    return (
        <div>
            <Sheet open={openSheet} onOpenChange={() => setOpenSheet(false)}>
                <div className='flex items-start justify-center flex-col gap-1 w-[35px] p-2 cursor-pointer' onClick={() => setOpenSheet(true)}>
                    <div className={`w-full h-[1px] bg-white block transition-all ease-in-out delay-75`} />
                    <div className={`w-full h-[1px] bg-white block transition-all ease-in-out delay-75`} />
                    <div className={`w-[80%] h-[1px] bg-white block transition-all ease-in-out delay-75`} />
                </div>

                <SheetContent side="left" className="p-0 space-y-5 rounded-tr-2xl rounded-br-2xl bg-white border-0 backdrop-blur-lg overflow-y-auto">
                    <MainMenu data={data} onClick={onClickHandler}/>
                    {/* <NeedHelp data={data} /> */}
                </SheetContent>
            </Sheet>
        </div>
    )
}
