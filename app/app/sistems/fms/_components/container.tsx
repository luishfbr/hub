"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Archive } from "./new-archive/archive";
import { Model } from "./new-model/model";
import { ContainerTables } from "./tables";

const tabs = [
  { id: "tables", label: "Tabelas" },
  { id: "models", label: "Criação de Modelos" },
  { id: "files", label: "Criação de Arquivos" },
];

export default function ContainerTabs() {
  const [selectedTab, setSelectedTab] = useState<string | null>("tables");

  const SelectTab = (id: string) => {
    setSelectedTab(id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className=" grid grid-cols-3 gap-4 items-center justify-center">
        {tabs.map((tab, index) => (
          <Button
            className="text-center"
            key={index}
            variant={selectedTab === tab.id ? "default" : "outline"}
            onClick={() => SelectTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      {selectedTab === "tables" && <ContainerTables />}
      {selectedTab === "models" && <Model />}
      {selectedTab === "files" && <Archive />}
    </div>
  );
}
