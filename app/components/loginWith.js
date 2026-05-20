import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import React from 'react'
import { IconGoogleColor, IconTikTok } from './svgIcons'

export default function LoginWith() {
    return (
        <div className='flex flex-col gap-5'>
            <Button variant="outlineRounded" className="flex w-full">
                <div className='pr-3'><IconGoogleColor style={{width: 20, height: 20}}/></div>Sign up with Google
            </Button>
            <Button variant="outlineRounded" className="flex w-full">
                <div className='pr-3'><IconTikTok style={{width: 20, height: 20}}/></div>Sign up with Tiktok
            </Button>
        </div>
    )
}
