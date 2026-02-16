"use client";

import { useEffect, useState } from "react";
import { getItemIconUrl } from "@/utils/itemIcons";

interface ItemIconProps {
  itemId: string;
  color: string;
  size?: number;
  glow?: boolean;
  className?: string;
}

export default function ItemIcon({
  itemId,
  color,
  size = 32,
  glow = false,
  className = "",
}: ItemIconProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    setIconUrl(getItemIconUrl(itemId, color));
  }, [itemId, color]);

  if (!iconUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: 4,
          boxShadow: glow ? `0 0 12px ${color}` : "none",
        }}
      />
    );
  }

  return (
    <img
      src={iconUrl}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{
        imageRendering: "auto",
        filter: glow ? `drop-shadow(0 0 8px ${color})` : "none",
      }}
      draggable={false}
    />
  );
}
