"use client";

import { Model, Sector } from "@/app/types/types";
import { useEffect, useState } from "react";
import { getModelsBySectorId, GetSectors } from "../../_actions/fms-actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditButton from "./_components/edit-button";
import { DeleteButton } from "./_components/delete-button";
import { AddNewFields } from "./_components/add-new-fields";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditModel() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [models, setModels] = useState<Model[]>([]);

  const handleSectorChange = async (sector: Sector) => {
    setSelectedSector(sector);
    const response = await getModelsBySectorId(sector.id as string);
    setModels(response || []);
  };

  const handleUpdate = async () => {
    if (selectedSector) {
      const response = await getModelsBySectorId(selectedSector.id as string);
      setModels(response || []);
    }
  };

  useEffect(() => {
    const fetchSectors = async () => {
      const response = await GetSectors();
      setSectors(response?.sectors || []);
    };

    fetchSectors();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 text-justify">
        <h1 className="text-2xl font-bold">Editar Modelo</h1>
        <span className="text-sm text-muted-foreground">
          Selecione o setor e o modelo que deseja editar.
        </span>
      </div>
      <CardContent>
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="flex items-center justify-center gap-4">
            {sectors.map((sector) => (
              <Button
                key={sector.id}
                onClick={() => handleSectorChange(sector)}
              >
                {sector.name}
              </Button>
            ))}
          </div>

          {selectedSector && (
            <Table className="px-4 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Nome do Modelo</TableHead>
                  <TableHead className="text-center">Editar Modelo</TableHead>
                  <TableHead className="text-center">Deletar Modelo</TableHead>
                  <TableHead className="text-center">
                    Adicionar Novos Campos
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.length > 0 ? (
                  models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="text-center">
                        {model.modelName}
                      </TableCell>
                      <TableCell className="text-center flex gap-6 items-center justify-center">
                        <EditButton
                          modelId={model.id}
                          onUpdate={handleUpdate}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <DeleteButton
                          modelId={model.id}
                          onDelete={handleUpdate}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <AddNewFields
                          modelId={model.id}
                          onAddField={handleUpdate}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Nenhum modelo encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </div>
  );
}
