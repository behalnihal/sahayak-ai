"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";
import {
  Send,
  Upload,
  FileText,
  Loader2,
  Copy,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { PREBUILT_PROMPTS, QA_PROMPT } from "@/lib/prompts";
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

// Enhanced MarkdownWithMermaid component
function MarkdownWithMermaid({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Initialize mermaid with theme-aware colors
    const isDark = document.documentElement.classList.contains("dark");
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      themeVariables: isDark
        ? {
            primaryColor: "#3b82f6",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#1e40af",
            lineColor: "#6b7280",
            sectionBkgColor: "#1f2937",
            altSectionBkgColor: "#374151",
            gridColor: "#4b5563",
            secondaryColor: "#10b981",
            tertiaryColor: "#f59e0b",
          }
        : {
            primaryColor: "#3b82f6",
            primaryTextColor: "#000000",
            primaryBorderColor: "#1e40af",
            lineColor: "#6b7280",
            sectionBkgColor: "#f8fafc",
            altSectionBkgColor: "#f1f5f9",
            gridColor: "#e2e8f0",
            secondaryColor: "#10b981",
            tertiaryColor: "#f59e0b",
          },
    });

    const codeBlocks = ref.current.querySelectorAll(
      "pre code.language-mermaid"
    );

    codeBlocks.forEach(async (block, i) => {
      const parent = block.parentElement;
      if (!parent || parent.querySelector("svg")) return;

      const code = block.textContent || "";
      try {
        const id = `mermaid-${i}-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        const temp = document.createElement("div");
        temp.innerHTML = svg;
        temp.className = "flex justify-center my-4";
        parent.replaceWith(temp);
      } catch (e) {
        console.warn("Mermaid rendering failed:", e);
      }
    });
  }, [content]);

  return (
    <div ref={ref} className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            if (className === "language-mermaid") {
              return (
                <pre>
                  <code className="language-mermaid">{children}</code>
                </pre>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function FooterHider() {
  if (typeof window !== "undefined") {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
  }
  return null;
}

export default function TopicChatPage() {
  const { topic: topicId } = useParams();
  const router = useRouter();
  const [topicName, setTopicName] = useState("Loading...");
  const [topicLoading, setTopicLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm here to help you learn about **${topicName}**. You can ask me anything, request explanations, create study materials, or upload a PDF for additional context. What would you like to explore first?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch topic data
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`/api/topics/${topicId}`);
        if (response.ok) {
          const data = await response.json();
          setTopicName(data.topic.title);
        } else {
          setTopicName("Unknown Topic");
        }
      } catch (error) {
        console.error("Error fetching topic:", error);
        setTopicName("Unknown Topic");
      } finally {
        setTopicLoading(false);
      }
    };

    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update initial message when topic name is loaded
  useEffect(() => {
    if (!topicLoading && topicName !== "Loading...") {
      setMessages([
        {
          role: "assistant",
          content: `Hi! I'm here to help you learn about **${topicName}**. You can ask me anything, request explanations, create study materials, or upload a PDF for additional context. What would you like to explore first?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [topicName, topicLoading]);

  const sendMessage = async (prompt: string, displayText?: string) => {
    if (!prompt.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: displayText || prompt,
      timestamp: new Date(),
    };

    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const fullPrompt = QA_PROMPT(topicName, prompt);
      const res = await fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((msgs) => [...msgs, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);

      const errorResponse: Message = {
        role: "assistant",
        content:
          "I apologize, but I encountered an error while processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
      };

      setMessages((msgs) => [...msgs, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrebuiltPrompt = (promptObj: (typeof PREBUILT_PROMPTS)[0]) => {
    const fullPrompt = promptObj.prompt(topicName);
    const displayText = `${promptObj.icon} ${promptObj.label}`;
    sendMessage(fullPrompt, displayText);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file only.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("File size must be less than 10MB.");
        return;
      }
      setPdfFile(file);
      setError(null);
      // TODO: Implement PDF processing
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hi! I'm here to help you learn about **${topicName}**. You can ask me anything, request explanations, create study materials, or upload a PDF for additional context. What would you like to explore first?`,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-4xl mx-auto pt-20 px-4">
      {/* Enhanced Header */}
      <div className="mb-6 p-4 bg-card rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Learning: {topicName}
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered study assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/quiz/${topicId}`)}
              className="gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Take Quiz
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Clear Chat
            </Button>
          </div>
        </div>
        {error && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {PREBUILT_PROMPTS.slice(0, 3).map((prompt) => (
            <Button
              key={prompt.label}
              variant="outline"
              size="sm"
              onClick={() => handlePrebuiltPrompt(prompt)}
              disabled={loading}
              className="gap-2"
            >
              <span>{prompt.icon}</span>
              {prompt.label}
            </Button>
          ))}
          <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <span>✨</span>
                More Options
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Study Tools</DialogTitle>
                <DialogDescription>
                  Choose a study tool to get started with {topicName}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2">
                {PREBUILT_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt.label}
                    variant="outline"
                    onClick={() => {
                      handlePrebuiltPrompt(prompt);
                      setShowPromptDialog(false);
                    }}
                    disabled={loading}
                    className="h-auto p-3 flex flex-col gap-1"
                  >
                    <span className="text-lg">{prompt.icon}</span>
                    <span className="text-xs">{prompt.label}</span>
                  </Button>
                ))}
              </div>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setShowPromptDialog(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Chat area and input fixed at bottom */}
      <div className="relative flex-1 flex flex-col min-h-0">
        <div
          className="flex-1 overflow-y-auto space-y-4 pb-4"
          style={{ minHeight: 0 }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "group relative rounded-lg px-4 py-3 max-w-[85%] transition-all duration-200",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto shadow-sm dark:bg-primary/20"
                  : "bg-card text-foreground mr-auto border shadow-sm hover:shadow-md dark:bg-card/50"
              )}
            >
              <div className="flex items-start gap-3">
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 dark:bg-primary/20">
                    <span className="text-xs">🤖</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {msg.role === "assistant" ? (
                    <MarkdownWithMermaid content={msg.content} />
                  ) : (
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  )}
                  {msg.timestamp && (
                    <div className="text-xs opacity-50 mt-2">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  )}
                </div>
                {msg.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(msg.content)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 max-w-[85%] mr-auto">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-primary/20">
                <span className="text-xs">🤖</span>
              </div>
              <div className="bg-card border rounded-lg px-4 py-3 shadow-sm dark:bg-card/50">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* PDF file preview (if any) */}
        {pdfFile && (
          <div className="absolute left-0 right-0 bottom-20 flex items-center gap-2 p-2 bg-primary/5 rounded border mx-2 z-10 dark:bg-primary/10">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium truncate max-w-xs">
              {pdfFile.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPdfFile(null)}
              className="ml-auto h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        )}

        {/* Chat input fixed at bottom */}
        <form
          className="sticky bottom-0 left-0 right-0 flex gap-2 items-end p-2 border rounded-t-lg bg-card shadow-sm z-20 dark:bg-card/50"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading && input.trim()) sendMessage(input);
          }}
          style={{ background: "var(--card)" }}
        >
          <div className="flex-1 flex items-center gap-2">
            <Input
              placeholder={`Ask me anything about ${topicName}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <label className="cursor-pointer mb-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfUpload}
              />
              <Button variant="ghost" size="icon" type="button">
                <Upload className="w-5 h-5" />
              </Button>
            </label>
          </div>
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            size="sm"
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
      <FooterHider />
    </div>
  );
}
