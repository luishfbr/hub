"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { Archive } from "./new-archive/archive";
import { Model } from "./new-model/model";
import { ContainerTables } from "./tables";
import { GetUser } from "../_actions/fms-actions";
import EditModel from "./edit-model/edit-model";
import { ImportModel } from "./import-model/import-model";

const tabs = [
  { id: "tables", label: "Tabelas" },
  { id: "models", label: "Criação de Modelos" },
  { id: "files", label: "Criação de Arquivos" },
  { id: "edit", label: "Edição de Modelos" },
  { id: "import", label: "Importação de Modelos" },
];

export default function ContainerTabs() {
  const [selectedTab, setSelectedTab] = useState<string | null>("tables");
  const [role, setRole] = useState<string | null>(null);

  const SelectTab = (id: string) => {
    setSelectedTab(id);
  };

  useEffect(() => {
    const fetchRole = async () => {
      const response = await GetUser();
      setRole(response?.role ?? null);
    };

    fetchRole();
  }, []);

  return (
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
  );
}
