import { TopicTable } from "@/components/dashboard/TopicTable";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <SignedIn>
        <div>
          <TopicTable />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
