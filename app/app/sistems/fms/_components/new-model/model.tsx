"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SectorSelect } from "./_components/sector-select";
import { GetSectors } from "../../_actions/fms-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sector } from "@/app/types/types";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";

interface NewModelProps {
  modelName: string;
  sectorId: string;
  fields: [
    {
      id: string;
      value: string;
      type: string;
    }
  ];
}

export const getIdFromInputType = (input: string): string => {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "");
};

export const Model = () => {
  const { toast } = useToast();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const { register, handleSubmit, watch, reset } = useForm<NewModelProps>();

  const fetchSectors = useCallback(async () => {
    try {
      const response = await GetSectors();
      if (response && response.sectors) {
        setSectors(response.sectors);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar setores. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex items-center justify-center gap-6 p-2">
        <SectorSelect
          sectors={sectors}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
        />
        {selectedSector && (
          <div className="flex gap-6">
            <Input
              type="text"
              placeholder="Qual o nome do modelo?"
              {...register("modelName")}
            />
            <Button onClick={() => setModelName(watch("modelName"))}>
              Prosseguir
            </Button>
          </div>
        )}
      </div>
      {modelName && (
        <div className="grid grid-cols-2 gap-6 h-[60vh]">
          <Card></Card>
          <Card></Card>
        </div>
      )}
    </div>
  );
};
