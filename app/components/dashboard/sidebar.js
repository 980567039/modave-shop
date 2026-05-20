import React from 'react'
import DashboardMainLogo from './mainLogo'
import DashboardMainMenus from './mainMenus'

export default function DashboardSidebar() {
    return (
        <div className="hidden md:block">
            <div className='h-full max-h-screen fixed left-0 top-0 md:w-[220px] lg:w-[280px]'>
                <div className="flex h-full max-h-screen flex-col gap-2 bg-white border-r-[1px]">
                    <DashboardMainLogo />
                    <div className="flex-1">
                        <DashboardMainMenus />
                    </div>
                </div>
            </div>
        </div>
    )
}
