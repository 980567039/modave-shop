"use client"

import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useEffect } from "react"

export function DatePickerWithRange({
    className,
    onDateChange,
    onClearDates,
    disableFutureDates = false,
    defaultValue,
}) {
    const [date, setDate] = useState(defaultValue || null)

    useEffect(() => {
        if (onDateChange) {
            onDateChange(date)
        }
    }, [date, onDateChange])

    const handleClear = () => {
        setDate(null);
        if (onClearDates) {
            onClearDates(true)
        }
    }

    // Only disable dates after today if disableFutureDates is true
    const today = new Date()
    const disabledDays = disableFutureDates ? { after: today } : undefined

    return (
        <div className={cn("grid gap-2", className)}>
            <div className="flex items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>选择日期</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            disabled={disabledDays}
                        />
                    </PopoverContent>
                </Popover>
                {date && (
                    <Button
                        variant="ghost"
                        onClick={handleClear}
                        className="ml-2 p-2"
                        aria-label="Clear date selection"
                    >
                        <X className="h-4 w-4" /> Clear Dates
                    </Button>
                )}
            </div>
        </div>
    )
}