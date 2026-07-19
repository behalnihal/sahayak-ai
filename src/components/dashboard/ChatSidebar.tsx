"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Loader2,
  Menu,
  MessageSquare,
  PanelLeftClose,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Topic {
  _id: string;
  id: string;
  title: string;
  createdAt: string;
}

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const params = useParams();
  const router = useRouter();
  const activeId = typeof params?.topic === "string" ? params.topic : "";
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/topics");
        if (res.ok) {
          const data = await res.json();
          setTopics(data.topics || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [activeId]);

  const renderSidebarBody = (isCollapsed: boolean) => (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center border-b border-border/50 py-3",
          isCollapsed ? "justify-center px-2" : "justify-between gap-2 px-3"
        )}
      >
        {!isCollapsed && (
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Topics</p>
              <p className="truncate text-[11px] text-muted-foreground">
                Switch conversation
              </p>
            </div>
          </div>
        )}
        <div className={cn("flex items-center gap-1", isCollapsed && "justify-center")}>
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 lg:inline-flex"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeftClose
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "flex border-b border-border/50 p-2",
          isCollapsed ? "justify-center" : "gap-2"
        )}
      >
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5",
            isCollapsed ? "h-9 w-9 px-0" : "flex-1"
          )}
          onClick={() => router.push("/dashboard")}
          title="Dashboard"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          {!isCollapsed && <span>Dashboard</span>}
        </Button>
        {!isCollapsed && (
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5"
            onClick={() => router.push("/dashboard")}
            title="Create a new topic from the dashboard"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : topics.length === 0 ? (
          <div className={cn("text-center", isCollapsed ? "py-4" : "px-2 py-8")}>
            <BookOpen
              className={cn(
                "mx-auto text-muted-foreground/50",
                isCollapsed ? "h-5 w-5" : "mb-2 h-8 w-8"
              )}
            />
            {!isCollapsed && (
              <>
                <p className="text-sm font-medium">No topics yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create one from the dashboard
                </p>
              </>
            )}
          </div>
        ) : (
          <ul className="space-y-1">
            {topics.map((topic) => {
              const active = topic.id === activeId;
              return (
                <li key={topic._id}>
                  <Link
                    href={`/dashboard/chat/${topic.id}`}
                    title={topic.title}
                    className={cn(
                      "flex items-center rounded-lg py-2 text-sm transition-colors",
                      isCollapsed ? "justify-center px-0" : "gap-2 px-2.5",
                      active
                        ? "bg-primary/15 font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <BookOpen
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{topic.title}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-24 left-4 z-40 h-10 w-10 rounded-full shadow-md lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open topics sidebar"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/50"
            aria-label="Close sidebar overlay"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col border-r border-border/60 bg-card shadow-xl">
            {renderSidebarBody(false)}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden h-full shrink-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition-[width] lg:flex",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        {renderSidebarBody(collapsed)}
      </aside>
    </>
  );
}
