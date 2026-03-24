import * as React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react"; // 또는 사용하시는 아이콘 라이브러리

// Popover 컴포넌트 (없다면 간단하게 구현)
const Popover = ({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-popover-content]")) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onOpenChange]);

  return (
    <div className="relative">
      {React.Children.map(children, (child, index) => {
        if (index === 0) return child; // Trigger
        if (index === 1 && isOpen) {
          return (
            <div
              data-popover-content
              className="absolute top-full left-0 z-50 mt-1 bg-white border rounded-md shadow-lg"
            >
              {child}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

// 기본 Input 컴포넌트
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

// 날짜 입력 컴포넌트
interface DateInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  value?: string | number | readonly string[];
  onChange?: (value: string) => void;
  placeholder?: string;
  dateFormat?: string;
}

function DateInput({
  className,
  value,
  onChange,
  placeholder = "YYYY/MM/DD",
  dateFormat = "yyyy/MM/dd",
  ...props
}: DateInputProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value && typeof value === "string" ? new Date(value) : undefined
  );
  const [dayPickerModule, setDayPickerModule] =
    React.useState<typeof import("react-day-picker") | null>(null);

  React.useEffect(() => {
    if (!open || dayPickerModule) return;
    let mounted = true;
    import("react-day-picker").then((mod) => {
      if (mounted) setDayPickerModule(mod);
    });
    return () => {
      mounted = false;
    };
  }, [open, dayPickerModule]);

  // value prop이 변경될 때 selectedDate 동기화
  React.useEffect(() => {
    if (value && typeof value === "string") {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(undefined);
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // YYYY-MM-DD 형식으로 변환 (input[type="date"] 호환)
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange?.(formattedDate);
    } else {
      onChange?.("");
    }
    setOpen(false);
  };

  const displayValue = selectedDate
    ? format(selectedDate, dateFormat, { locale: ko })
    : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <div className="relative">
        <Input
          {...props}
          className={cn("cursor-pointer pr-10", className)}
          placeholder={placeholder}
          value={displayValue}
          readOnly
          onClick={() => setOpen(true)}
        />
        <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-3">
        {dayPickerModule ? (
          <dayPickerModule.DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={ko}
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
              ),
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        ) : (
          <div className="flex h-[240px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            캘린더 로딩 중...
          </div>
        )}
      </div>
    </Popover>
  );
}

// 통합된 Input 컴포넌트 (기존 Input을 확장)
function EnhancedInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  // date 타입인 경우 DateInput 사용
  if (type === "date") {
    const { value, onChange, ...dateProps } = props;
    return (
      <DateInput
        className={className}
        value={value}
        onChange={onChange as ((value: string) => void) | undefined}
        {...dateProps}
      />
    );
  }

  // 일반 input
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input, DateInput, EnhancedInput };

// 사용 예시:
/*
// react-hook-form과 함께 사용
<EnhancedInput
  id="start_datetime"
  type="date"
  {...register("start_datetime")}
  className={errors.start_datetime ? "border-red-500" : ""}
/>

// 또는 직접 DateInput 사용
<DateInput
  value={startDate}
  onChange={setStartDate}
  placeholder="날짜를 선택하세요"
  dateFormat="yyyy/MM/dd"
  className={errors.start_datetime ? "border-red-500" : ""}
/>
*/
