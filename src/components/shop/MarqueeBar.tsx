import Image from "next/image";

export function MarqueeBar() {
  return (
    <div className="overflow-hidden border-y border-white/5 bg-black py-2">
      <div className="flex items-center justify-center">
        <div className="relative h-[42px] w-[2100px] max-w-full shrink-0">
          <Image
            src="/assets/marquee/kravicky-jdouci.jpg"
            alt="Pruh s kravičkami"
            fill
            sizes="2100px"
            className="object-contain object-center"
          />
        </div>
      </div>
    </div>
  );
}
