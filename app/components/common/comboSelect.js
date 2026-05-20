"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { formatCategories } from "@/lib/common"

export function ComboSelect({
    data,
    type,
    label,
    onSelectItem
}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("");
    const [displayData, setDisplayData] = useState([]);

    const getIndentationLevel = (title) => {
        const match = title.match(/^-+/);
        return match ? match[0].length : 0;
    };

    const formatCategoriesWithAddLevel = (categories) => {

        return formatCategories(categories).map(category => ({
            ...category,
            indentationLevel: getIndentationLevel(category.title),
            displayTitle: category.title.replace(/^-+/, '')
        }));
    };

    const handlerClear = () => {
        setValue('');
    }

    useEffect(() => {
        if (type === "category") {
            const getFormattedCategories = formatCategoriesWithAddLevel(data);

            const getDisplayData = getFormattedCategories.map((d) => {
                return {
                    ...d,
                    value: d._id,
                    label: d.title,
                }
            });

            setDisplayData(getDisplayData);
        }
    }, [type, data]);

    useEffect(() => {
        onSelectItem(value)
    }, [value])




    return (
        <div className="flex gap-2 items-center">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {value
                            ? displayData.find((d) => d.value === value)?.label
                            : label || "Select..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        {/* <CommandInput placeholder={`Search ${label || ''}...`} /> */}
                        <CommandList>
                            <CommandEmpty>Not found.</CommandEmpty>
                            <CommandGroup>
                                {displayData.map((d) => (
                                    <CommandItem
                                        key={d.value}
                                        value={d.value}
                                        className="cursor-pointer"
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === d.value ? "opacity-100" : "opacity-0",
                                                `mr-[${d.indentationLevel * 20}px]`
                                            )}
                                        />
                                        <div style={{ marginLeft: `${d.indentationLevel * 15}px` }} className={`${d.indentationLevel !== 0 ? 'flex items-center' : ''}`}>{d.displayTitle}</div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {value !== "" && <Button variant="ghost" onClick={handlerClear}><X className="w-4 h-4 mr-2"/>Clear</Button>}
        </div>
    )
}
