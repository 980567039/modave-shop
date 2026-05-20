import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { LoaderCircle, Trash } from 'lucide-react'
import React, { useState } from 'react'

export default function ActionButton({ onContinue, isLoading = false, title, content, textColor, buttonBackground, buttonHover, icon }) {
    const [openAlert, setOpenAlert] = useState(false);

    const handlerContinue = () => {
        setOpenAlert(false);
        onContinue(true);
    }
    return (
        <div>
            <Button onClick={() => setOpenAlert(true)} className={`w-9 h-9 rounded-full ${buttonBackground} flex items-center justify-center p-0 hover:${buttonHover} z-20 cursor-pointer`}>
                {!isLoading && icon}
                {isLoading && <LoaderCircle className={`animate-spin ${textColor} w-4 h-4`} />}
            </Button>
            <AlertDialog open={openAlert} onOpenChange={() => setOpenAlert(false)}>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {content}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlerContinue}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
