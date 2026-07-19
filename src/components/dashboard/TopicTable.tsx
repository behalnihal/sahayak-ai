"use client";

import {
  BookOpen,
  MessageSquare,
  PlusIcon,
  TrashIcon,
  Loader2,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import Link from "next/link";
import {
  DashboardShell,
  PageHeader,
  Surface,
  TokenBadge,
} from "./DashboardShell";
import { cn } from "@/lib/utils";

interface Topic {
  _id: string;
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const TopicTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [tokens, setTokens] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
    fetchTokens();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/topics");
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics || []);
      } else {
        setError("Could not load topics. Please try again.");
      }
    } catch {
      setError("Could not load topics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async () => {
    if (!newTopicTitle.trim()) return;

    setCreating(true);
    setError(null);
    try {
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTopicTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        setTopics([data.topic, ...topics]);
        setNewTopicTitle("");
        setIsOpen(false);
      } else {
        setError("Failed to create topic.");
      }
    } catch {
      setError("Failed to create topic.");
    } finally {
      setCreating(false);
    }
  };

  const deleteTopic = async (topicId: string) => {
    setDeletingId(topicId);
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTopics(topics.filter((t) => t._id !== topicId));
      } else {
        setError("Failed to delete topic.");
      }
    } catch {
      setError("Failed to delete topic.");
    } finally {
      setDeletingId(null);
    }
  };

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

  if (loading) {
    return (
      <DashboardShell size="xl">
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading your topics…</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell size="xl">
      <PageHeader
        title="My Topics"
        description="Create topics and open a chat to learn with mind maps, summaries, and quizzes."
        icon={<BookOpen className="h-5 w-5 text-primary" />}
        meta={<TokenBadge tokens={tokens} />}
        actions={
          <Button onClick={() => setIsOpen(true)} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Topic
          </Button>
        }
      />

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Surface className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Topics</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {topics.length}
          </p>
        </Surface>
        <Surface className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Tokens</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {tokens ?? "—"}
          </p>
        </Surface>
        <Surface className="col-span-2 px-4 py-3 sm:col-span-1">
          <p className="text-xs text-muted-foreground">Study tools</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Chat · Mindmap · Quiz
          </p>
        </Surface>
      </div>

      {topics.length === 0 ? (
        <Surface className="flex flex-col items-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-muted/40">
            <MessageSquare className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No topics yet</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Create your first topic to start chatting, generate mind maps, and
            take quizzes on any subject.
          </p>
          <Button onClick={() => setIsOpen(true)} className="mt-6 gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Topic
          </Button>
        </Surface>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Surface
              key={topic._id}
              className="group flex flex-col transition-colors hover:border-border hover:bg-card"
            >
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground opacity-70 hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                    onClick={() => deleteTopic(topic._id)}
                    disabled={deletingId === topic._id}
                    aria-label={`Delete ${topic.title}`}
                  >
                    {deletingId === topic._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <Link
                  href={`/dashboard/chat/${topic.id}`}
                  className="min-w-0 flex-1"
                >
                  <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {topic.title}
                  </h3>
                </Link>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(topic.createdAt)}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-border/50 px-4 py-3 sm:px-5">
                <Button asChild size="sm" className="flex-1 gap-2">
                  <Link href={`/dashboard/chat/${topic.id}`}>
                    Open chat
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn("hidden sm:inline-flex")}
                >
                  <Link href={`/dashboard/quiz/${topic.id}`}>Quiz</Link>
                </Button>
              </div>
            </Surface>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new topic</DialogTitle>
            <DialogDescription>
              Name a subject you want to learn. You can chat, summarize, and
              quiz yourself on it next.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-1">
            <Input
              type="text"
              placeholder="e.g. JavaScript Fundamentals"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !creating) {
                  createTopic();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={createTopic}
              disabled={creating || !newTopicTitle.trim()}
              className="gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4" />
                  Create
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
};
