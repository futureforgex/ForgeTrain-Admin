import * as React from "react"
import { format, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  value?: Date | null
  onChange?: (date: Date | undefined) => void
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  className,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(() => {
    if (value instanceof Date && isValid(value)) {
      return value
    }
    return undefined
  })

  React.useEffect(() => {
    if (value instanceof Date && isValid(value)) {
      setSelectedDate(value)
    } else if (value === null) {
      setSelectedDate(undefined)
    }
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      setSelectedDate(date)
      onChange?.(date)
    } else {
      setSelectedDate(undefined)
      onChange?.(undefined)
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date || !isValid(date)) return ""
    try {
      return format(date, "HH:mm")
    } catch (error) {
      console.error("Error formatting date:", error)
      return ""
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate && isValid(selectedDate) ? (
            format(selectedDate, "PPP HH:mm")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t">
          <input
            type="time"
            className="w-full p-2 border rounded"
            value={formatDate(selectedDate)}
            onChange={(e) => {
              if (selectedDate && isValid(selectedDate)) {
                try {
                  const [hours, minutes] = e.target.value.split(":")
                  const newDate = new Date(selectedDate)
                  newDate.setHours(parseInt(hours))
                  newDate.setMinutes(parseInt(minutes))
                  if (isValid(newDate)) {
                    handleDateSelect(newDate)
                  }
                } catch (error) {
                  console.error("Error updating time:", error)
                }
              }
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
} 