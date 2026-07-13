import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

type FaqProps = {
  items: FaqItem[];
  className?: string;
};

export function Faq({ items, className }: FaqProps) {
  return (
    <Accordion
      className={cn(
        "rounded-2xl border border-foreground/10 bg-background/60 px-2 sm:px-4",
        className
      )}
    >
      {items.map((item, i) => (
        <AccordionItem key={item.question} value={`item-${i}`}>
          <AccordionTrigger className="px-3 py-5 text-base font-medium">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-5 text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
