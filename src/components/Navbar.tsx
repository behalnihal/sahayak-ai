import { FaBrain, FaGithub } from "react-icons/fa";
import { ModeToggle } from "./mode-toggle";
export const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-background/50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div>
            <FaBrain className=" me-[5px] w-5 h-5 inline" />
            <span className="text-xl font-bold">Sahayak AI</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com/behalnihal/sahayak-ai">
              <FaGithub className="w-5 h-5" />
            </a>

            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
