"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import { PencilRuler, Ruler } from "lucide-react";
import { SiteContext } from "@/app/contexts/siteContexts";
import Image from "next/image";

export function SizeChart({ data }) {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { themeData } = useContext(SiteContext);

    const sizeChart = useMemo(() => {
        if (themeData && themeData?.common?.sizeCharts) {
            return themeData?.common?.sizeCharts?.find((d) => d.uniqueId === data?.sizeChart);
        }
    }, [data, themeData]);    

    if (sizeChart) {
        
        if (isDesktop) {
            return (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="link" className="xl:text-white/55 text-[10px] pr-0"><Ruler className="w-3 h-3 " size={10}/>Size Chart</Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3x max-w-[800px]">
                        <DialogHeader>
                            <DialogTitle className="font-headingFontMedium uppercase">{sizeChart?.title} - Size Chart</DialogTitle>
                        </DialogHeader>
                        <ProfileForm sizeChart={sizeChart} isDesktop={isDesktop} />
                    </DialogContent>
                </Dialog>
            )
        }

        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="link"><Ruler className="mr-2 w-5 h-5 " />Size Chart</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle  className="font-headingFontMedium uppercase" >{sizeChart?.title} - Size Chart</DrawerTitle>
                    </DrawerHeader>
                    <ProfileForm className="px-4" sizeChart={sizeChart} isDesktop={isDesktop} />
                    <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    } else {
        return null
    }

}

function ProfileForm({ sizeChart, isDesktop }) {
    return (
        <div className="">
            {sizeChart && Object.keys(sizeChart).length !== 0 && <>
                <img
                    src={isDesktop ? sizeChart?.image : sizeChart?.mobileImage}
                    alt="Size chart"
                    width={1000}
                    height={800}
                />
            </>}
        </div>
    )
}
