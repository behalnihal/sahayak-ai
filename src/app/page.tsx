import { Hero } from "@/components/landing/Hero";
import { Navbar } from "../components/Navbar";
import { Features } from "@/components/landing/Features";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}
