"use client";

import { VelocityScroll } from "@/app/components/theme/text/scrollBasedVelocity";
import { AdminContext } from "@/app/contexts/adminContexts";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useContext, useEffect, useState } from "react"

export default function SiteMovingText({ onChange }) {
    const { store } = useContext(AdminContext);

    const [text, setText] = useState('Nuvie Clothing')
    const [velocity, setVelocity] = useState(0.7);

    useEffect(() => {
        onChange({
            text,
            velocity,
        })
    }, [text, velocity]);

    useEffect(() => {
        if(store && store?.theme && store?.theme?.header){
            setText(store?.theme?.header?.movingText?.text)
            setVelocity(store?.theme?.header?.movingText?.velocity)
        }
    }, [store]);

    return (
        <>
            <div className="w-[500px] overflow-hidden">
                <VelocityScroll text={text || "Nuvie Clothing"} default_velocity={velocity} className="text-3xl font-medium" />
            </div>
            <div className='flex gap-3'>
                <Input
                    className="flex-1"
                    type="text"
                    placeholder="主标题"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="flex-1">
                    <span className="mb-3 text-xs text-muted-foreground block">速度</span>
                    <Slider defaultValue={[0.7]} max={10} step={0.01} onValueChange={(e) => {
                        setVelocity(e);

                    }} />
                </div>
            </div>
        </>
    )
}