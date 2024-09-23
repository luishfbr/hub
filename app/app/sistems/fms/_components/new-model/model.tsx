"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SectorSelect } from "./_components/sector-select";
import { createNewModel, GetSectors } from "../../_actions/fms-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldType, FieldTypeOptions, Sector, Option } from "@/app/types/types";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const getIdFromInputType = (input: string): string => {
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
  const [modelName, setModelName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [newField, setNewField] = useState<Field>({ value: '', type: 'text', id: '', options: [], fieldLabel: '' });
  const [newOption, setNewOption] = useState<string>('');

  const fetchSectors = useCallback(async () => {
    try {
      const response = await GetSectors();
      if (response?.sectors) {
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

  const handleAddField = () => {
    if (newField.value) {
      setFields([...fields, { ...newField, id: getIdFromInputType(newField.value) }]);
      setNewField({ value: '', type: 'text', id: '', options: [], fieldLabel: '' });
    }
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleAddOption = () => {
    if (newOption) {
      const option: Option = { id: getIdFromInputType(newOption), value: newOption };
      setNewField({ ...newField, options: [...(newField.options || []), option] });
      setNewOption('');
    }
  };

  const handleDeleteOption = (id: string) => {
    setNewField({ ...newField, options: newField.options?.filter((option) => option.id !== id) });
  };

  const handleSubmit = async () => {
    if (!modelName || !selectedSector || fields.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      modelName,
      selectedSector,
      fields: fields.map(field => ({
        ...field,
        ...(field.type === 'select' ? { options: field.options } : {})
      })),
    };
    const formDataWithSectorId = {
      ...formData,
      sectorId: formData.selectedSector
    };

    const res = await createNewModel(formDataWithSectorId);
    if (res) {
      toast({
        title: "Sucesso",
        description: "Modelo criado com sucesso.",
        variant: "success",
      });
    }
  };

  return (
    <ScrollArea className="flex flex-col gap-6 w-full h-[890px] p-4 md:p-8">
      <div className="flex flex-col gap-6 items-center w-full">
        <div className="flex flex-col gap-6 items-center w-full max-w-lg">
          <SectorSelect
            sectors={sectors}
            selectedSector={selectedSector}
            setSelectedSector={setSelectedSector}
          />
          <Input
            className="w-full"
            type="text"
            placeholder="Nome do modelo"
            value={modelName}
            autoComplete="off"
            onChange={(e) => setModelName(e.target.value)}
          />
        </div>
        {selectedSector && (
          <div className="flex flex-col gap-6 items-center w-full">
            {/* Adicionar campos */}
            <div className="flex flex-col gap-6 items-center w-full">
              <Card className="flex flex-col gap-6 p-4 w-full max-w-lg">
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <Input
                    className="flex-1"
                    type="text"
                    placeholder="Nome do campo"
                    value={newField.value}
                    onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                  />
                  <Select
                    required
                    value={newField.type}
                    onValueChange={(value: FieldType) => setNewField({ ...newField, type: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Tipo do campo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {FieldTypeOptions.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button variant="destructive" onClick={handleAddField}>
                    <PlusIcon className="w-5 h-5" />
                  </Button>
                </div>
                {newField.type === 'select' && (
                  <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col md:flex-row gap-6">
                      <Input
                        className="flex-1"
                        type="text"
                        placeholder="Adicionar opção"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                      />
                      <Button variant="destructive" onClick={handleAddOption}>
                        <PlusIcon className="w-5 h-5" />
                      </Button>
                    </div>
                    {(newField.options?.length ?? 0) > 0 && (
                      <ScrollArea className="w-full">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Opção</TableHead>
                              <TableHead>Excluir</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {newField.options?.map((option) => (
                              <TableRow key={option.id}>
                                <TableCell>{option.value}</TableCell>
                                <TableCell>
                                  <Button variant="ghost" onClick={() => handleDeleteOption(option.id)}>
                                    <TrashIcon className="w-5 h-5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    )}
                  </div>
                )}
              </Card>
            </div>
            <div className="flex flex-col gap-6 w-full max-w-lg">
              {fields.length > 0 && (
                <ScrollArea className="w-full h-[200px] overflow-y-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Excluir</TableHead>
                        {fields.some(field => field.type === 'select') && (
                          <TableHead>Opções</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field) => (
                        <TableRow key={field.id}>
                          <TableCell>{field.value}</TableCell>
                          <TableCell>{field.type}</TableCell>
                          <TableCell>
                            <Button variant="ghost" onClick={() => handleDeleteField(field.id)}>
                              <TrashIcon className="w-5 h-5" />
                            </Button>
                          </TableCell>
                          {field.type === 'select' && (
                            <TableCell>
                              <Select>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Opções" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {field.options?.map((option) => (
                                      <SelectItem key={option.id} value={option.value}>
                                        {option.value}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
              <Button onClick={handleSubmit}>
                Salvar Modelo
              </Button>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
