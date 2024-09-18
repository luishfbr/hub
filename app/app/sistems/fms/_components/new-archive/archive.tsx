"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useCallback } from "react";
import { getModelsBySectorId, GetSectors } from "../../_actions/fms-actions";
import { SelectedModelForm } from "./_components/model-card";
import { useToast } from "@/hooks/use-toast";
import { Model, Sector } from "@/app/types/types";

export function Archive() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchSectors = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedSectors = await GetSectors();
      setSectors(fetchedSectors?.sectors || []);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao carregar setores. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  const handleChangeModel = useCallback(
    (modelId: string) => {
      const selected = models.find((model) => model.id === modelId) || null;
      setSelectedModel(selected);
    },
    [models]
  );

  const handleChangeSector = useCallback(
    async (sectorId: string) => {
      try {
        setIsLoading(true);
        const selected =
          sectors.find((sector) => sector.id === sectorId) || null;
        setSelectedSector(selected);
        if (selected) {
          const response = await getModelsBySectorId(selected.id);
          setModels(response.filter((model) => model.modelName !== null));
        }
      } catch (err) {
        toast({
          title: "Erro",
          description: "Erro ao carregar modelos. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [sectors, toast]
  );

  return (
    <div className="flex flex-col gap-6 items-center justify-center text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Crie seu novo arquivo</h1>
        <span className="text-sm text-muted-foreground">
          Selecione o setor e o modelo que deseja criar.
        </span>
      </div>
      <div className="flex flex-col gap-6">
        <Select onValueChange={handleChangeSector} disabled={isLoading}>
          <SelectTrigger className="w-auto">
            <SelectValue
              placeholder={isLoading ? "Carregando..." : "Selecione um Setor"}
            />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector.id} value={sector.id}>
                {sector.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedSector && (
          <Select onValueChange={handleChangeModel} disabled={isLoading}>
            <SelectTrigger className="w-auto">
              <SelectValue
                placeholder={
                  isLoading ? "Carregando..." : "Selecione um Modelo"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.modelName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {selectedModel && <SelectedModelForm modelId={selectedModel.id} />}
    </div>
  );
}
