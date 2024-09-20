"use client";

import styles from "@/app/styles/main.module.css";
import { Model, Sector } from "@/app/types/types";
import { useEffect, useState } from "react";
import { getModelsBySectorId, GetSectors } from "../../_actions/fms-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import EditButton from "./_components/edit-button";
import { DeleteButton } from "./_components/delete-button";

export default function EditModel() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [models, setModels] = useState<Model[]>([]);

  const handleSectorChange = async (sector: Sector) => {
    setSelectedSector(sector);
    const id = sector.id as string;
    const response = await getModelsBySectorId(id);
    setModels(response || []);
  };

  const handleUpdate = async () => {
    const id = selectedSector?.id as string;
    const response = await getModelsBySectorId(id);
    setModels(response || []);
  };

  useEffect(() => {
    const fetchSectors = async () => {
      const response = await GetSectors();
      setSectors(response?.sectors || []);
    };

    fetchSectors();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-center gap-4">
        {sectors.map((sector) => (
          <Button key={sector.id} onClick={() => handleSectorChange(sector)}>
            {sector.name}
          </Button>
        ))}
      </div>

      {selectedSector ? (
        <div className="mx-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Nome do Modelo</TableHead>

                <TableHead className="text-center">Editar</TableHead>
                <TableHead className="text-center">Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.length > 0 ? (
                models.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="text-center">
                      {model.modelName}
                    </TableCell>
                    <TableCell className="text-center">
                      <EditButton
                        modelId={model.id}
                        onUpdate={() => handleUpdate()}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <DeleteButton
                        modelId={model.id}
                        onDelete={() => handleUpdate()}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Nenhum modelo encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
