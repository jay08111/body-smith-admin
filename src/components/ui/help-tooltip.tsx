import * as React from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  iconSize?: number;
}

export function HelpTooltip({
  content,
  side = "top",
  className,
  iconSize = 16,
}: HelpTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle
          size={iconSize}
          className={cn(
            "text-muted-foreground hover:text-foreground cursor-help transition-colors",
            className
          )}
        />
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}