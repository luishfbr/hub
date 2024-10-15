"use client";

import { Archive } from "./new-archive/archive";
import { Model } from "./new-model/model";
import { ContainerTables } from "./tables";
import EditModel from "./edit-model/edit-model";
import { ImportModel } from "./import-model/import-model";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContainerProps {
  tab: string;
}

export default function Main({ tab }: ContainerProps) {
  return (
    <ScrollArea className="h-[88vh] w-full">
      {tab === "tables" && <ContainerTables />}
      {tab === "models" && <Model />}
      {tab === "files" && <Archive />}
      {tab === "edit" && <EditModel />}
      {tab === "import" && <ImportModel />}
    </ScrollArea>
  );
}
