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
  ArrowLeft,
  Bot,
  User,
  Sparkles,
  Check,
} from "lucide-react";
import { PREBUILT_PROMPTS, QA_PROMPT } from "@/lib/prompts";
import Mermaid from "@/components/mermaid/mermaid";
import prepareMermaidCode from "@/lib/prepareMermaid";
import {
  DashboardShell,
  Surface,
  TokenBadge,
} from "@/components/dashboard/DashboardShell";
import { ChatSidebar } from "@/components/dashboard/ChatSidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date | string;
  type?: "mindmap";
  id?: string;
}

function MarkdownWithMermaid({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !ref.current) return;

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
        temp.className = "flex justify-center my-4 overflow-x-auto";
        try {
          if (parent.parentNode) {
            parent.replaceWith(temp);
          }
        } catch {
          // React re-render race
        }
      } catch (e) {
        console.warn("Mermaid rendering failed:", e);
      }
    });
  }, [content, isClient]);

  return (
    <div ref={ref} className="markdown-body text-sm sm:text-[0.95rem]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            if (className === "language-mermaid") {
              return isClient ? (
                <pre>
                  <code className="language-mermaid">{children}</code>
                </pre>
              ) : (
                <div style={{ minHeight: 40 }} />
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

function welcomeMessage(topicName: string): Message {
  return {
    role: "assistant",
    content: `Hi! I'm here to help you learn about **${topicName}**. Ask questions, generate study materials, or pick a quick tool below to get started.`,
    timestamp: new Date(),
  };
}

function normalizeMessages(value: unknown): Message[] | null {
  if (!Array.isArray(value)) return null;

  const messages = value.filter((message): message is Message => {
    return (
      message &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string"
    );
  });

  return messages.length > 0 ? messages : null;
}

export default function TopicChatPage() {
  const { topic: topicId } = useParams();
  const topicKey = typeof topicId === "string" ? topicId : "";
  const router = useRouter();
  const [topicName, setTopicName] = useState("Loading...");
  const [topicLoading, setTopicLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    welcomeMessage("this topic"),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tokens, setTokens] = useState<number | null>(null);
  const [chatHydrated, setChatHydrated] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`/api/topics/${topicKey}`);
        if (response.ok) {
          const data = await response.json();
          setTopicName(data.topic.title);
          setMessages(
            normalizeMessages(data.topic.messages) ||
              [welcomeMessage(data.topic.title)]
          );
        } else {
          setTopicName("Unknown Topic");
          setMessages([welcomeMessage("this topic")]);
        }
      } catch (err) {
        console.error("Error fetching topic:", err);
        setTopicName("Unknown Topic");
        setMessages([welcomeMessage("this topic")]);
      } finally {
        setTopicLoading(false);
        setChatHydrated(true);
      }
    };

    if (topicKey) {
      setTopicLoading(true);
      setChatHydrated(false);
      fetchTopic();
      fetchTokens();
    }
  }, [topicKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!chatHydrated || !topicKey || loading) return;

    const saveMessages = async () => {
      try {
        await fetch(`/api/topics/${topicKey}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });
      } catch (err) {
        console.error("Error saving chat:", err);
      }
    };

    saveMessages();
  }, [chatHydrated, loading, messages, topicKey]);

  const fetchTokens = async () => {
    try {
      const response = await fetch("/api/user/tokens");
      if (response.ok) {
        const data = await response.json();
        setTokens(data.tokens);
      }
    } catch {
      setTokens(null);
    }
  };

  const sendMessage = async (prompt: string, displayText?: string) => {
    if (!prompt.trim()) return;

    if (tokens !== null && tokens <= 0) {
      setError(
        "You have no tokens left. Please get more tokens to continue chatting."
      );
      return;
    }

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

      if (res.status === 429) {
        setError(
          "You have no tokens left. Please get more tokens to continue chatting."
        );
        setTokens(0);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const isMindmap =
        data.response.includes("graph TD") ||
        data.response.includes("graph LR") ||
        data.response.includes("```mermaid");

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        ...(isMindmap && {
          type: "mindmap" as const,
          id: `mindmap-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        }),
      };

      setMessages((msgs) => [...msgs, assistantMessage]);
      if (typeof data.tokens === "number") setTokens(data.tokens);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);

      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          content:
            "I apologize, but I encountered an error while processing your request. Please try again or rephrase your question.",
          timestamp: new Date(),
        },
      ]);
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
        setError("File size must be less than 10MB.");
        return;
      }
      setPdfFile(file);
      setError(null);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const clearChat = () => {
    const resetMessages = [welcomeMessage(topicName)];
    setMessages(resetMessages);
    setError(null);
  };

  const noTokens = tokens !== null && tokens <= 0;

  return (
    <DashboardShell fullHeight size="full" className="pb-4">
      <div className="flex min-h-0 flex-1 gap-4">
        <ChatSidebar />

        <main className="flex min-w-0 flex-1 flex-col">
      {/* Header */}
      <Surface className="mb-3 shrink-0 px-3 py-3 sm:mb-4 sm:px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="mt-0.5 h-9 w-9 shrink-0"
              onClick={() => router.push("/dashboard")}
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                  {topicLoading ? "Loading…" : topicName}
                </h1>
                <TokenBadge tokens={tokens} />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                AI study chat · mind maps · summaries · quizzes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pl-12 sm:pl-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/quiz/${topicKey}`)}
              className="gap-1.5"
            >
              <HelpCircle className="h-4 w-4" />
              Quiz
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
      </Surface>

      {/* Quick actions */}
      <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2 sm:mb-4">
        {PREBUILT_PROMPTS.slice(0, 3).map((prompt) => (
          <Button
            key={prompt.label}
            variant="outline"
            size="sm"
            onClick={() => handlePrebuiltPrompt(prompt)}
            disabled={loading || noTokens}
            className="gap-1.5 rounded-full bg-card/50"
          >
            <span aria-hidden>{prompt.icon}</span>
            <span className="hidden sm:inline">{prompt.label}</span>
            <span className="sm:hidden">{prompt.label.split(" ")[0]}</span>
          </Button>
        ))}

        <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 rounded-full"
              disabled={loading || noTokens}
            >
              <Sparkles className="h-4 w-4" />
              More tools
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Study tools</DialogTitle>
              <DialogDescription>
                Pick a tool to generate material for{" "}
                <span className="font-medium text-foreground">{topicName}</span>
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
                  disabled={loading || noTokens}
                  className="h-auto flex-col gap-1.5 p-4"
                >
                  <span className="text-lg">{prompt.icon}</span>
                  <span className="text-xs font-medium">{prompt.label}</span>
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

      {/* Messages + composer */}
      <Surface className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
          {messages.map((msg, idx) => {
            const msgId = msg.id || `msg-${idx}`;
            const isUser = msg.role === "user";

            return (
              <div
                key={msgId}
                className={cn(
                  "flex gap-2.5 sm:gap-3",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                    isUser
                      ? "border-primary/20 bg-primary/15 text-primary"
                      : "border-border/60 bg-muted/50 text-muted-foreground"
                  )}
                >
                  {isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                <div
                  className={cn(
                    "group relative max-w-[min(100%,42rem)] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm sm:px-4 sm:py-3",
                    isUser
                      ? "rounded-tr-md bg-primary text-primary-foreground"
                      : "rounded-tl-md border border-border/50 bg-background/60"
                  )}
                >
                  {msg.role === "assistant" && msg.type === "mindmap" ? (
                    <Mermaid
                      id={msg.id || `mermaid-${idx}`}
                      chart={prepareMermaidCode({ code: msg.content })}
                      key={msg.id || `mermaid-${idx}`}
                    />
                  ) : msg.role === "assistant" ? (
                    <MarkdownWithMermaid content={msg.content} />
                  ) : (
                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                      {msg.content}
                    </div>
                  )}

                  {msg.role === "assistant" && msg.type !== "mindmap" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(msg.content, msgId)}
                      className="absolute -right-1 -top-1 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Copy message"
                    >
                      {copiedId === msgId ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 sm:gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/50 text-muted-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-md border border-border/50 bg-background/60 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* PDF chip */}
        {pdfFile && (
          <div className="mx-3 mb-2 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 sm:mx-4">
            <FileText className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate text-sm font-medium">{pdfFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPdfFile(null)}
              className="ml-auto h-6 w-6 p-0"
              aria-label="Remove file"
            >
              ×
            </Button>
          </div>
        )}

        {/* Composer */}
        <form
          className="border-t border-border/50 bg-card/40 p-3 sm:p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading && input.trim()) sendMessage(input);
          }}
        >
          <div className="flex items-end gap-2 rounded-xl border border-border/60 bg-background/70 p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring/30">
            <Input
              placeholder={
                noTokens
                  ? "No tokens left…"
                  : `Ask anything about ${topicLoading ? "this topic" : topicName}…`
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading || noTokens}
              className="min-h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="shrink-0"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload PDF"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              disabled={loading || !input.trim() || noTokens}
              size="icon"
              className="shrink-0"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 px-1 text-[11px] text-muted-foreground">
            Enter to send · PDF upload is attached for context (processing may
            be limited)
          </p>
        </form>
      </Surface>
        </main>
      </div>
    </DashboardShell>
  );
}
