import { SiteContext } from '@/app/contexts/siteContexts'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Store, Truck } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns'
import { useTranslations } from 'next-intl'

export default function LocationSelector({
  selectedFulfillmentType,
  setFulfillmentType,
  onChangeSelect,
  control
}) {
  const t = useTranslations("checkout");
  const { themeData, setStoreData } = useContext(SiteContext);
  const [selectedButton, setSelectedButton] = useState('');
  const [pickUpLocation, setPickUpLocations] = useState([]);


  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return addDays(today, 4);
  });

  const handlerChangeFulfillType = (type) => {
    setStoreData((prevData) => ({
      ...prevData,
      fulfillmentType: type
    }));
    setFulfillmentType(type)
  }

  useEffect(() => {
    setSelectedButton(selectedFulfillmentType);
  }, [selectedFulfillmentType])

  const isMonthFullyDisabled = (month) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const today = new Date();
    const twoDaysAgo = addDays(today, -2);
    const fourDaysAhead = addDays(today, 4);

    return end < twoDaysAgo || start < fourDaysAhead;
  }

  const handleMonthChange = (month) => {
    if (isMonthFullyDisabled(month)) {
      const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
      setCurrentMonth(nextMonth);
    } else {
      setCurrentMonth(month);
    }
  }

  useEffect(() => {
    if (themeData && themeData?.storeLocations?.locations) {
      const checkIfHave = themeData?.storeLocations?.locations?.some((d) => d.isPickUpLocation);
      const filterPickUpLocation = themeData?.storeLocations?.locations?.filter((d) => d.isPickUpLocation);

      setPickUpLocations(checkIfHave ? filterPickUpLocation : []);
    }
  }, [themeData])

  return (
    <>
      <div className='flex flex-col md:flex-row mb-5 rounded-[40px] md:rounded-full border-[1px] p-1 gap-1 md:gap-4'>
        <div
          type="button"
          className={`flex-1 flex flex-col md:flex-row items-center gap-2 md:gap-6 font-headingFontMedium tracking-widest uppercase text-sm transition-all cursor-pointer ease-in-out rounded-full p-1 ${selectedButton === 'delivery' ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-100 '}`}
          onClick={() => handlerChangeFulfillType('delivery')}
        >
          <div className={`w-[35px] h-[35px] md:w-[46px] md:h-[46px] rounded-full flex items-center justify-center ${selectedButton === 'delivery' ? 'bg-white' : 'bg-gray-200'}`}>
            <Truck className={`w-6 h-6 ${selectedButton === 'delivery' ? 'text-black' : ''}`} strokeWidth={1} />
          </div>
          {t("homeDelivery")}
        </div>
        <div
          type="button"
          className={`flex-1 flex flex-col md:flex-row items-center gap-2 md:gap-6 font-headingFontMedium tracking-widest uppercase text-sm transition-all cursor-pointer ease-in-out  rounded-full p-1 ${selectedButton === 'pickup' ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-100 '}`}
          onClick={() => handlerChangeFulfillType('pickup')}
        >
          <div className={`w-[35px] h-[35px] md:w-[46px] md:h-[46px] rounded-full flex items-center justify-center ${selectedButton === 'pickup' ? 'bg-white' : 'bg-gray-200'}`}>
            <Store className={`w-6 h-6 ${selectedButton === 'pickup' ? 'text-black' : ''}`} strokeWidth={1} />
          </div>
          {t("storePickup")}
        </div>
      </div>

      {selectedButton === 'pickup' && (
        <div className='mb-5 flex flex-col md:flex-row gap-5'>
          <FormField
            control={control}
            name="pickUpLocation"
            render={({ field }) => (
              <FormItem className="w-full">

                <FormLabel className="text-xs font-semibold">Select a pickup store location<span className='text-red-500'>*</span></FormLabel>
                
                {pickUpLocation && pickUpLocation?.length > 0 && <>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      onChangeSelect?.(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full rounded-full">
                        {field.value && field.value !== '' ? <div className='flex flex-col items-start cursor-pointer'>
                          {field.value}
                        </div> : <SelectValue placeholder="Select a store pickup location" />
                        }
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-[30px]">
                      {pickUpLocation?.map((store, i) => (
                        <SelectItem
                          key={i}
                          value={store.locationName}
                          className="rounded-3xl"
                        >
                          <div className='flex flex-col items-start cursor-pointer'>
                            {store.locationName}
                            <span className='text-muted-foreground text-xs'>{store.address}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>}
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="pickupDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs font-semibold">{t("selectPickupDate")}<span className='text-red-500'>*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-full mt-0 gap-2",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon strokeWidth={1} />
                      {field.value ? format(field.value, "PPP") : <span>{t("pickDate")}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-auto flex-col space-y-2 p-2 rounded-[20px]">
                    <Select
                      onValueChange={(value) =>
                        field.onChange(addDays(new Date(), parseInt(value)))
                      }
                    >
                      <SelectTrigger className="rounded-[20px]">
                        <SelectValue placeholder={t("select")} />
                      </SelectTrigger>
                      <SelectContent position="popper" className="rounded-[20px]">
                        <SelectItem value="3">{t("inThreeDays")}</SelectItem>
                        <SelectItem value="7">{t("inAWeek")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="rounded-[20px] border">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        month={currentMonth}
                        onMonthChange={handleMonthChange}
                        disabled={(date) => {
                          const today = new Date();
                          const twoDaysAgo = addDays(today, -2);
                          const fourDaysAhead = addDays(today, 4);
                          return date <= today || date < fourDaysAhead;
                        }}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      )}
    </>
  )
}
