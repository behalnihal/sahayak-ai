"use client";
import { EditIcon, PlusIcon, TrashIcon, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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

interface Topic {
  _id: string;
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export const TopicTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [tokens, setTokens] = useState<number | null>(null);

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
      }
    } catch {
      console.error("Error fetching topics:");
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async () => {
    if (!newTopicTitle.trim()) return;

    setCreating(true);
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
      }
    } catch {
      console.error("Error creating topic:");
    } finally {
      setCreating(false);
    }
  };

  const deleteTopic = async (topicId: string) => {
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTopics(topics.filter((t) => t._id !== topicId));
      }
    } catch {
      console.error("Error deleting topic:");
    }
  };

  const fetchTokens = async () => {
    try {
      const response = await fetch("/api/user/tokens");
      if (response.ok) {
        const data = await response.json();
        setTokens(data.tokens);
        console.log(data.tokens);
      }
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setTokens(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 bg-background text-foreground">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 bg-background text-foreground dark:bg-background/50 dark:text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Topics</h1>
        <div className="flex items-center gap-4">
          {tokens !== null && (
            <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full border">
              Tokens left: {tokens}
            </span>
          )}
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            New Topic
          </Button>
        </div>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No topics yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first topic to get started with learning.
          </p>
          <Button onClick={() => setIsOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Topic
          </Button>
        </div>
      ) : (
        <Table className="rounded-2xl border">
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow
                key={topic._id}
                className="hover:bg-muted/50 cursor-pointer"
              >
                <TableCell>
                  <Link
                    href={`/dashboard/chat/${topic.id}`}
                    className="text-primary underline font-medium"
                  >
                    {topic.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(topic.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement edit functionality
                    }}
                  >
                    <EditIcon className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTopic(topic._id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
            <DialogDescription>
              Create a new topic to start learning about it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="e.g., JavaScript Fundamentals"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !creating) {
                  createTopic();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={createTopic}
              disabled={creating || !newTopicTitle.trim()}
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Topic"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
