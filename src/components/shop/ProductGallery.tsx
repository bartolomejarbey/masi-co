"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
  productName: string;
}

export function ProductGallery({ mainImage, gallery, productName }: ProductGalleryProps) {
  const allImages = [mainImage, ...gallery];
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-gray-200">
        <Image
          src={allImages[selectedIndex]}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
          priority
        />
      </div>
      {allImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {allImages.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === selectedIndex ? "border-primary" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image src={url} alt={`${productName} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
