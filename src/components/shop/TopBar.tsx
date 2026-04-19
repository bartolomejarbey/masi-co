import { Clock, Phone, Mail } from "lucide-react";

export function TopBar() {
  return (
    <div className="hidden bg-black text-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
        <div className="flex items-center gap-2 text-[13px] tracking-[0.05em]">
          <Clock size={14} className="shrink-0 opacity-70" />
          <span>Objednávky do 12:00 expedujeme týž den</span>
        </div>
        <div className="flex items-center gap-5 text-[13px] tracking-[0.05em]">
          <a
            href="tel:+420222533001"
            className="flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <Phone size={14} className="shrink-0 opacity-70" />
            <span>+420 222 533 001</span>
          </a>
          <a
            href="mailto:objednavky@masi-co.com"
            className="flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <Mail size={14} className="shrink-0 opacity-70" />
            <span>objednavky@masi-co.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}
