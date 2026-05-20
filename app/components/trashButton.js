import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { LoaderCircle, Trash } from 'lucide-react'
import React, { useState } from 'react'

export default function TrashButton({onContinue, isLoading = false, title, content, iconClasses = null, customIcon = null}) {
    const [openAlert, setOpenAlert] = useState(false);

    const handlerContinue = () => {
        setOpenAlert(false);
        onContinue(true);
    }

    return (
        <div>
            <Button 
                onClick={() => setOpenAlert(true)} 
                className={`w-9 h-9 rounded-full bg-red-100 flex items-center justify-center p-0 hover:bg-red-300 z-20 cursor-pointer ${iconClasses}`}
            >
                {isLoading ? (
                    <LoaderCircle className='animate-spin text-red-500 w-4 h-4' />
                ) : (
                    customIcon || <Trash className='text-red-500 w-4 h-4 block' />
                )}
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