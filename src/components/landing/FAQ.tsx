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
    answer:
      "You can reach out to our support team via the contact form or email us directly at support@example.com.",
  },
];

export function FAQ() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center tracking-tight">
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
            className="border-none"
          >
            <AccordionTrigger className="text-base md:text-lg font-medium px-6 py-4 focus:outline-none">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300 text-sm md:text-base">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
