import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
export const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-background/50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link className="flex items-center gap-2" href={"/"}>
            <Image src="/logo.svg" alt="Sahayak AI" width={32} height={32} />
            <span className="text-xl font-bold">Sahayak AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <a href="https://github.com/behalnihal/sahayak-ai">
              <FaGithub className="w-5 h-5" />
            </a>

            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
