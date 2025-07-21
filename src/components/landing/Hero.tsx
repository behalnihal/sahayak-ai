"use client";

import { motion } from "framer-motion";
import { BlurFade } from "../magicui/blur-fade";
import { SparklesText } from "../magicui/sparkles-text";
import { NumberTicker } from "../magicui/number-ticker";
import Link from "next/link";
import { ArrowRightIcon, Brain } from "lucide-react";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { DotPattern } from "../magicui/dot-pattern";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const Hero = () => {
  const { isSignedIn } = useUser();
  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-6 px-6 pt-32 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
      />
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4" />
        <span className="bg-muted px-4 py-1 rounded-full relative z-10 text-xs border-2 border-neutral-600">
          Learn Better
        </span>
      </div>

      <motion.div variants={itemVariants}>
        <BlurFade
          delay={0.25}
          inView
          className="font-display text-3xl text-center md:text-7xl font-bold w-full lg:w-auto max-w-4xl mx-auto -z-10"
        >
          <span>Your personal tutor for</span>
          <br />
          <SparklesText>Learning Anything</SparklesText>
        </BlurFade>
      </motion.div>

      <motion.h2
        className="mt-2 text-base md:text-xl text-muted-foreground tracking-normal text-center max-w-2xl mx-auto z-10"
        variants={itemVariants}
      >
        Get instant summaries, mind maps, take MCQ tests, and retain{" "}
        <NumberTicker value={100} />% more effectively.
      </motion.h2>

      <motion.div variants={itemVariants} className="z-20 py-16">
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button className=" rounded-full">
            Get Started
            <ArrowRightIcon className="w-8 h-8 transform transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};
