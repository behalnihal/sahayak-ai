"use client";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";
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
import { v4 as uuidv4 } from "uuid";

interface Topic {
  id: string;
  name: string;
  status: boolean;
  progress: number;
}

export const TopicTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([
    // Example topics for demonstration
    { id: uuidv4(), name: "React Basics", status: true, progress: 60 },
    { id: uuidv4(), name: "Node.js", status: false, progress: 30 },
    { id: uuidv4(), name: "Machine Learning", status: true, progress: 80 },
  ]);
  const [newTopic, setNewTopic] = useState<Topic>({
    id: uuidv4(),
    name: "",
    status: false,
    progress: 0,
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 bg-background text-foreground">
      <span className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <PlusIcon className="w-4 h-4" />
          New Topic
        </Button>
      </span>
      <Table className="rounded-2xl border">
        <TableHeader>
          <TableRow>
            <TableHead>Topic</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.map((topic, index) => (
            <TableRow
              key={topic.id}
              className="hover:bg-muted/50 cursor-pointer"
            >
              <TableCell>
                <Link
                  href={`/dashboard/chat/${topic.id}`}
                  className="text-primary underline"
                >
                  {topic.name}
                </Link>
              </TableCell>
              <TableCell>{topic.status ? "Active" : "Inactive"}</TableCell>
              <TableCell>{topic.progress}%</TableCell>
              <TableCell className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 mr-2"
                  onClick={() => {
                    // edit topic
                    setIsOpen(true);
                  }}
                >
                  <EditIcon className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => {
                    // delete topic
                    setTopics(topics.filter((t) => t.id !== topic.id));
                  }}
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Topic</DialogTitle>
            <DialogDescription>
              Create a new topic to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Eg. JavaScript"
              value={newTopic.name}
              onChange={(e) =>
                setNewTopic({ ...newTopic, name: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsOpen(false);
                setTopics([...topics, { ...newTopic, id: uuidv4() }]);
                setNewTopic({
                  id: uuidv4(),
                  name: "",
                  status: false,
                  progress: 0,
                });
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
