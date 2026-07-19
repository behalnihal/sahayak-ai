"use client";

import mermaid from "mermaid";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Maximize2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Initialize mermaid once globally
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

const Mermaid = ({ chart, id }: { chart: string; id: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const renderChart = async () => {
      if (!chart || !containerRef.current) {
        return;
      }

      setError(null);
      setSvg("");

      try {
        const uniqueId = `mermaid-${id}-${Date.now()}`;
        const { svg: renderedSvg } = await mermaid.render(uniqueId, chart);
        if (!isCancelled) {
          setSvg(renderedSvg);
        }
      } catch (e) {
        console.error("Mermaid render error:", e);
        if (!isCancelled) {
          setError("Failed to render diagram.");
        }
      }
    };

    renderChart();

    return () => {
      isCancelled = true;
    };
  }, [chart, id]);

  const copyDiagram = async () => {
    if (!svg) return;

    try {
      const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const objectUrl = URL.createObjectURL(svgBlob);
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Unable to load diagram."));
        image.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Unable to prepare diagram copy.");
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(objectUrl);

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Unable to export diagram."));
        }, "image/png");
      });

      if ("ClipboardItem" in window) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": pngBlob }),
        ]);
      } else {
        await navigator.clipboard.writeText(chart);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (copyError) {
      console.error("Failed to copy diagram image:", copyError);
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const DiagramSvg = ({ className }: { className?: string }) => (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      className={className}
    />
  );

  return (
    <div ref={containerRef} className="my-4 mermaid-container">
      <div className="overflow-hidden rounded-xl border border-border/60 bg-background/70">
        <div className="flex items-center justify-between gap-3 border-b border-border/50 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Mind map</p>
            <p className="text-xs text-muted-foreground">
              {collapsed ? "Collapsed" : "Interactive diagram"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyDiagram}
              disabled={!svg || Boolean(error)}
              aria-label="Copy mind map image"
              title="Copy mind map image"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={collapsed ? "Show mind map" : "Collapse mind map"}
              title={collapsed ? "Show mind map" : "Collapse mind map"}
            >
              {collapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setExpanded(true)}
              disabled={!svg || Boolean(error)}
              aria-label="Expand mind map"
              title="Expand mind map"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!collapsed && (
          <div className="overflow-x-auto p-4">
            {error && (
              <div className="rounded-lg border border-destructive/20 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
            {!svg && !error && (
              <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Rendering diagram...
              </div>
            )}
            {svg && !error && (
              <DiagramSvg className="mx-auto min-w-max [&_svg]:h-auto [&_svg]:max-w-none" />
            )}
          </div>
        )}
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] gap-3 p-4 sm:max-w-6xl">
          <DialogHeader className="pr-8">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle>Mind map</DialogTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={copyDiagram}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Copy
              </Button>
            </div>
          </DialogHeader>
          <div className="max-h-[calc(100dvh-8rem)] overflow-auto rounded-lg border border-border/60 bg-background p-4">
            {svg && !error && (
              <DiagramSvg className="mx-auto min-w-max [&_svg]:h-auto [&_svg]:max-w-none" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Mermaid;
