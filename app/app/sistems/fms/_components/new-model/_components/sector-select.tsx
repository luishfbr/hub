"use client";

import React, { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sector } from "@/app/types/types";

interface SectorSelectProps {
  sectors: Sector[];
  selectedSector: string | null;
  setSelectedSector: (sector: string) => void;
}

export const SectorSelect: React.FC<SectorSelectProps> = ({
  sectors,
  selectedSector,
  setSelectedSector,
}) => {
  const sortedSectors = useMemo(
    () => sectors.sort((a, b) => a.name.localeCompare(b.name)),
    [sectors]
  );

  return (
    <Select
      onValueChange={setSelectedSector}
      value={selectedSector || undefined}
    >
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Selecione um Setor" />
      </SelectTrigger>
      <SelectContent>
        {sortedSectors.map((sector) => (
          <SelectItem key={sector.id} value={sector.id}>
            {sector.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
