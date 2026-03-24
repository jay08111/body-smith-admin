import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const normalizeDateTime = (value?: string) => {
  if (!value) return "";
  if (value.includes("T")) return value.slice(0, 16);
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T00:00`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00`;
  if (value.includes(" ")) {
    const [date, time] = value.split(" ");
    const timePart = (time ?? "").split(".")[0];
    const [hh = "00", mm = "00"] = timePart.split(":");
    return `${date}T${hh}:${mm}`;
  }
  return value;
};

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "날짜/시간 선택",
  className,
}: DateTimePickerProps) {
  const initialDate = useMemo(() => {
    const normalized = normalizeDateTime(value);
    if (!normalized) return undefined;
    const parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) return undefined;
    return parsed;
  }, [value]);

  const initialTime = useMemo(() => {
    const normalized = normalizeDateTime(value);
    if (!normalized) return { hour: "00", minute: "00" };
    const time = normalized.split("T")[1] ?? "00:00";
    const [hour = "00", minute = "00"] = time.split(":");
    return { hour, minute };
  }, [value]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);

  useEffect(() => {
    setSelectedDate(initialDate);
    setHour(initialTime.hour);
    setMinute(initialTime.minute);
  }, [initialDate, initialTime]);

  const emitValue = (date: Date | undefined, nextHour = hour, nextMinute = minute) => {
    if (!date) {
      onChange("");
      return;
    }
    const next = new Date(date);
    next.setHours(Number(nextHour));
    next.setMinutes(Number(nextMinute));
    next.setSeconds(0);
    onChange(format(next, "yyyy-MM-dd'T'HH:mm"));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    emitValue(date);
  };

  const handleHourChange = (nextHour: string) => {
    setHour(nextHour);
    emitValue(selectedDate, nextHour, minute);
  };

  const handleMinuteChange = (nextMinute: string) => {
    setMinute(nextMinute);
    emitValue(selectedDate, hour, nextMinute);
  };

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  const displayValue = selectedDate
    ? format(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          Number(hour),
          Number(minute)
        ),
        "yyyy-MM-dd HH:mm"
      )
    : "";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={["w-full justify-start text-left font-normal", className]
            .filter(Boolean)
            .join(" ")}
        >
          {displayValue || <span className="text-muted-foreground">{placeholder}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-3">
          <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} />
          <div className="mt-3 flex gap-2">
            <Select value={hour} onValueChange={handleHourChange}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="시" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={minute} onValueChange={handleMinuteChange}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="분" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
