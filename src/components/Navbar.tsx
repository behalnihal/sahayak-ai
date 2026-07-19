"use client";

import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const pathname = usePathname();
  const onDashboard = pathname?.startsWith("/dashboard");

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-2" href="/">
              <Image src="/logo.svg" alt="Sahayak AI" width={32} height={32} />
              <span className="text-lg font-semibold tracking-tight sm:text-xl">
                Sahayak AI
              </span>
            </Link>

            <SignedIn>
              <Link
                href="/dashboard"
                className={cn(
                  "hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:inline-flex",
                  onDashboard
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </SignedIn>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/behalnihal/sahayak-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="GitHub"
            >
              <FaGithub className="h-5 w-5" />
            </a>

            <SignedOut>
              <Button asChild size="sm" variant="outline">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};
