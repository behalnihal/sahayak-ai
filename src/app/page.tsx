import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Subscription } from "@/components/landing/Subscription";
import { FAQ } from "@/components/landing/FAQ";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Subscription />
      <FAQ />
    </div>
  );
}
