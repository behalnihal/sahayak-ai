import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "What is this service about?",
    answer:
      "This service provides a modern, minimalistic platform to help you achieve your goals efficiently and effectively.",
  },
  {
    question: "How can I get started?",
    answer:
      "Simply sign up with your email address and follow the onboarding steps to get started.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a free trial so you can explore all features before committing.",
  },
  {
    question: "How do I contact support?",
    answer: "You can reach out to me on Github",
  },
];

export function FAQ() {
  return (
    <section className="relative bg-background/50 backdrop-blur-sm border-y border-border/50">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          defaultValue={faqData[faqData.length - 1].question}
        >
          {faqData.map((item) => (
            <AccordionItem
              value={item.question}
              key={item.question}
              className="border-none bg-card/50 backdrop-blur-sm rounded-lg mb-2"
            >
              <AccordionTrigger className="text-base md:text-lg font-medium px-6 py-4 focus:outline-none text-foreground hover:text-foreground/80">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted-foreground text-sm md:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
