import { TopicTable } from "@/components/dashboard/TopicTable";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <SignedIn>
        <TopicTable />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
