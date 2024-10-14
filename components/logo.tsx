"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import darkLogo from "@/components/assets/logo-for-dark.png";
import lightLogo from "@/components/assets/logo-for-light.png";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoSrc = resolvedTheme === "dark" ? darkLogo : lightLogo;

  return (
    <Link href={"/app/sistems"}>
      <Image
        src={logoSrc}
        width={220}
        height={220}
        alt="Logo Sicoob Uberaba"
        className="p-2"
      />
    </Link>
  );
}
