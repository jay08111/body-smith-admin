import { useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import ReactCountryFlag from "react-country-flag";
import { cn } from "@/lib/utils";
import {
  getLangDisplayNames,
  getLangMeta,
  getStoredLang,
  normalizeLangCode,
} from "@/lib/lang";

interface ServerTitleProps {
  className?: string;
  children: React.ReactNode;
  showFlag?: boolean;
  showLabel?: boolean;
}

export function ServerTitle({
  className,
  children,
  showFlag = true,
  showLabel = true,
}: ServerTitleProps) {
  const location = useLocation();
  const displayNames = useMemo(() => getLangDisplayNames(), []);

  const params = new URLSearchParams(location.searchStr);
  const urlLang = normalizeLangCode(params.get("lang") ?? "");
  const lang = urlLang || getStoredLang();

  if (!lang || (!showFlag && !showLabel)) {
    return <span className={className}>{children}</span>;
  }

  const meta = getLangMeta(lang, displayNames);
  const hasPrefix = Boolean(meta.label || meta.region);

  if (!hasPrefix) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {showFlag && meta.region ? (
        <ReactCountryFlag
          countryCode={meta.region}
          svg
          style={{ width: "1rem", height: "1rem" }}
          aria-label={meta.region}
        />
      ) : null}
      {showLabel ? <strong className="font-semibold">{meta.label}</strong> : null}
      <span>{children}</span>
    </span>
  );
}
