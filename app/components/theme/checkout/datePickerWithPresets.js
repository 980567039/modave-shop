"use client"

import { useState } from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function DatePickerWithPresets({}) {
    const [date, setDate] = useState()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full h-[50px] justify-start text-left font-normal rounded-none mt-0 gap-2",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon strokeWidth={1}/>
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2 rounded-none">
                <Select
                    onValueChange={(value) =>
                        setDate(addDays(new Date(), parseInt(value)))
                    }
                >
                    <SelectTrigger className="rounded-none">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="rounded-none">
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                    </SelectContent>
                </Select>
                <div className="rounded-md border">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => {
                            const today = new Date();
                            const twoDaysAgo = new Date(today.setDate(today.getDate() - 2));
                            const tomorrow = new Date();
                            tomorrow.setDate(today.getDate() + 4); // Today + 4 days to include tomorrow
                            return date < twoDaysAgo || (date >= today && date < tomorrow);
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
