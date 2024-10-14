"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { getSectorsByUserId } from "../../admin/_components/cards/_actions/users";
import { TableContainer } from "./table/table-component";
import { getModelsBySectorId } from "../_actions/fms-actions";
import { Model, Sector } from "@/app/types/types";
import { Skeleton } from "@/components/ui/skeleton";

export const ContainerTables = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchSectors = useCallback(async () => {
    try {
      const response = await getSectorsByUserId();
      setSectors(response?.sectors ?? []);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    } finally {
    }
  }, []);

  const handleChangeSector = useCallback(
    async (sectorId: string) => {
      const sector = sectors.find((sector) => sector.id === sectorId) || null;
      setSelectedSector(sector);
      setSelectedModel(null);
      try {
        const models = await getModelsBySectorId(sectorId);
        if (models) {
          setModels(models.filter((model) => model.modelName !== null));
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    },
    [sectors]
  );

  const handleChangeModel = useCallback(
    (modelId: string) => {
      const model = models.find((model) => model.id === modelId) || null;
      setSelectedModel(model);
    },
    [models]
  );

  const debouncedSearch = useCallback((value: string) => {
    const delayedSearch = debounce((searchValue: string) => {
      setSearchTerm(searchValue);
    }, 300);

    delayedSearch(value);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 p-2">
        <Select
          onValueChange={handleChangeSector}
          value={selectedSector?.id || ""}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Selecione o Setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {selectedSector && (
          <Select
            onValueChange={handleChangeModel}
            value={selectedModel?.id || ""}
          >
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Selecione o Modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.modelName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <Input
          type="text"
          placeholder="Pesquisar..."
          onChange={handleSearchChange}
          className="w-full md:w-64"
        />
      </div>

      {selectedModel ? (
        <TableContainer modelId={selectedModel.id} searchTerm={searchTerm} />
      ) : (
        <div className="flex flex-col gap-2 items-center text-center">
          <span className="text-muted-foreground">
            Selecione um setor e um modelo para visualizar a tabela de arquivos
            arquivos
          </span>
          <Skeleton className="w-full h-80" />
        </div>
      )}
    </div>
  );
};
