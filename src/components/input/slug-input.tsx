import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HelpTooltip } from "@/components/ui/help-tooltip";

interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  tooltip?: string;
}

const SlugInput: React.FC<SlugInputProps> = ({
  value,
  onChange,
  title,
  error,
  placeholder = "URL에 사용될 슬러그를 입력하세요",
  label = "슬러그",
  required = false,
  tooltip,
}) => {
  const generateSlugFromTitle = () => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
      onChange(slug);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="slug">
          {label} {required && "*"}
        </Label>
        {tooltip && <HelpTooltip content={tooltip} side="right" />}
      </div>
      <div className="space-y-2">
        <Input
          id="slug"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-red-500" : ""}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateSlugFromTitle}
          className="w-fit"
          disabled={!title}
        >
          제목과 동일
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SlugInput;
