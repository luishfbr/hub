"use client";

import { Button } from "@/components/ui/button";
import { useState, useMemo, useCallback } from "react";
import { Tables } from "./tables";
import { Archive } from "./archive";
import { Model } from "./model";

const tabs = [
  { id: "tables", label: "Tabelas" },
  { id: "models", label: "Criação de Modelos" },
  { id: "files", label: "Criação de Arquivos" },
];

export default function ContainerTabs() {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const SelectTab = (id: string) => {
    setSelectedTab(id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-6 grid grid-cols-3 gap-4 items-center justify-center">
        {tabs.map((tab, index) => (
          <Button
            className="text-center"
            key={index}
            onClick={() => SelectTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      {selectedTab === "tables" && <Tables />}
      {selectedTab === "models" && <Model />}
      {selectedTab === "files" && <Archive />}
    </div>
  );
}
