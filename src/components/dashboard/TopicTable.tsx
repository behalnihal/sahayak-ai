import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
export const TopicTable = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 bg-background text-foreground">
      <span className="flex justify-end mb-4"></span>
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
          <TableRow>{/* fill table */}</TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
