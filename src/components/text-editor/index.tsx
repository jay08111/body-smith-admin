import React, { Suspense, useMemo } from "react";

const LazyJoditEditor = React.lazy(() => import("jodit-react"));

import "./style.css";

interface RichTextEditorProps {
  value: string;
  onChange?: (content: string) => void;
  height?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  height = "480px",
  placeholder = "내용을 입력하세요...",
  readOnly = false,
}: RichTextEditorProps) {
  const config = useMemo(
    () => ({
      readonly: readOnly,
      placeholder,
      height: parseInt(height.replace("px", ""), 10),
      language: "ko",
      saveModeInCookies: false,
      toolbar: true,
      toolbarAdaptive: false,
      toolbarSticky: false,
      allowIframe: true,
      cleanHTML: {
        allowTags:
          "hr,iframe,p,a,img,table,tr,td,th,tbody,thead,h1,h2,h3,h4,h5,h6,div,span,br,strong,em,u,s,ul,ol,li,blockquote,pre,code",
        allowAttributes: false,
      },
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "font",
        "fontsize",
        "|",
        "brush",
        "paragraph",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "align",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "|",
        "link",
        "unlink",
        "|",
        "table",
        "image",
        "youtube",
        "|",
        "fullsize",
      ],
      controls: {
        youtube: {
          name: "youtube",
          tooltip: "유튜브 동영상 삽입",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
          exec(editor: any) {
            const url = window.prompt("유튜브 URL을 입력하세요.");
            if (!url) {
              return;
            }

            const match = url.match(
              /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
            );
            const videoId = match?.[1];
            if (!videoId) {
              window.alert("유효한 유튜브 URL이 아닙니다.");
              return;
            }

            editor.selection.insertHTML(
              `<div class="youtube-wrapper"><iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p><br /></p>`
            );
          },
        },
      },
    }),
    [height, placeholder, readOnly]
  );

  return (
    <Suspense
      fallback={
        <div className="flex min-h-40 items-center justify-center rounded-md border bg-muted/40 text-sm text-muted-foreground">
          에디터를 불러오는 중입니다.
        </div>
      }
    >
      <LazyJoditEditor
        value={value}
        config={config}
        onBlur={(content: string) => onChange?.(content)}
      />
    </Suspense>
  );
}
