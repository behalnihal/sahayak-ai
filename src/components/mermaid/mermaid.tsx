import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";

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

  return (
    <div
      ref={containerRef}
      className="flex justify-center my-4 mermaid-container"
    >
      {error && (
        <div className="p-4 text-sm text-destructive border border-destructive/20 rounded">
          {error}
        </div>
      )}
      {!svg && !error && (
        <div className="p-4 text-sm text-muted-foreground">
          Rendering diagram...
        </div>
      )}
      {svg && !error && (
        <div
          dangerouslySetInnerHTML={{ __html: svg }}
          className="w-full h-full"
        />
      )}
    </div>
  );
};

export default Mermaid;
