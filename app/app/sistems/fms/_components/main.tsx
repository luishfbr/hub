"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import ContainerTabs from "./container";

export default function Main() {
  return (
    <ScrollArea className="h-[88vh] w-full">
      <ContainerTabs />
    </ScrollArea>
  );
}
