"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type AccordionSection = {
  title: string;
  content: string;
};

interface ProductAccordionProps {
  sections: AccordionSection[];
}

export function ProductAccordion({ sections }: ProductAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {sections.map((section, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={section.title} className="border-b border-gray-200">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900 transition-colors hover:text-primary"
            >
              {section.title}
              <ChevronDown
                size={16}
                className={`shrink-0 text-gray-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-200 ${
                isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                  {section.content
                    .split(/\n{2,}/)
                    .map((paragraph, pIndex) => (
                      <p key={pIndex} className="whitespace-pre-line">
                        {paragraph.trim()}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
