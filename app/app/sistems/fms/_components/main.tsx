"use client";

import { Button } from "@/components/ui/button";

import { Archive } from "./new-archive/archive";
import { Model } from "./new-model/model";
import { ContainerTables } from "./tables";
import EditModel from "./edit-model/edit-model";
import { ImportModel } from "./import-model/import-model";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const tabs = [
  { id: "tables", label: "Tabelas" },
  { id: "models", label: "Criação de Modelos" },
  { id: "files", label: "Criação de Arquivos" },
  { id: "edit", label: "Edição de Modelos" },
  { id: "import", label: "Importação de Modelos" },
];

interface ContainerProps {
  role: string;
}

export default function Main({ role }: ContainerProps) {
  const [selectedTab, setSelectedTab] = useState<string | null>("tables");

  const SelectTab = (id: string) => {
    setSelectedTab(id);
  };

  return (
    <ScrollArea className="h-[88vh] w-full">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-center justify-center">
          {tabs.map((tab, index) =>
            (role === "USER" && tab.id === "tables") || role !== "USER" ? (
              <Button
                className="text-center"
                key={index}
                variant={selectedTab === tab.id ? "default" : "outline"}
                onClick={() => SelectTab(tab.id)}
              >
                {tab.label}
              </Button>
            ) : null
          )}
        </div>
        {selectedTab === "tables" && <ContainerTables />}
        {selectedTab === "models" && role !== "USER" && <Model />}
        {selectedTab === "files" && role !== "USER" && <Archive />}
        {selectedTab === "edit" && role !== "USER" && <EditModel />}
        {selectedTab === "import" && role !== "USER" && <ImportModel />}
      </div>
    </ScrollArea>
  );
}
