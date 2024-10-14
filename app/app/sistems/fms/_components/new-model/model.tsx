"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SectorSelect } from "./_components/sector-select";
import { createNewModel, GetSectors } from "../../_actions/fms-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldType,
  FieldTypeOptions,
  Sector,
  Option,
} from "@/app/types/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, PlusIcon, TrashIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [modelName, setModelName] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [newField, setNewField] = useState<Field>({
    value: "",
    type: "text",
    id: "",
    options: [],
    fieldLabel: "",
  });
  const [newOption, setNewOption] = useState<string>("");

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
      setFields([
        ...fields,
        { ...newField, id: getIdFromInputType(newField.value) },
      ]);
      setNewField({
        value: "",
        type: "text",
        id: "",
        options: [],
        fieldLabel: "",
      });
    }
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleAddOption = () => {
    if (newOption) {
      const option: Option = {
        id: getIdFromInputType(newOption),
        value: newOption,
      };
      setNewField({
        ...newField,
        options: [...(newField.options || []), option],
      });
      setNewOption("");
    }
  };

  const handleDeleteOption = (id: string) => {
    setNewField({
      ...newField,
      options: newField.options?.filter((option) => option.id !== id),
    });
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
      fields: fields.map((field) => ({
        ...field,
        ...(field.type === "select" ? { options: field.options } : {}),
      })),
    };
    const formDataWithSectorId = {
      ...formData,
      sectorId: formData.selectedSector,
    };

    const res = await createNewModel(formDataWithSectorId);
    if (res) {
      toast({
        title: "Sucesso",
        description: "Modelo criado com sucesso.",
        variant: "success",
      });
    } else {
      toast({
        title: "Erro",
        description:
          "Não foi possível criar o modelo. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full p-0.5">
      <div className="flex flex-col gap-2 text-justify">
        <h1 className="text-2xl font-bold">
          Painel de criação de novos modelos
        </h1>
        <span className="text-sm text-muted-foreground">
          Crie novos modelos com base em suas necessidades, atualmente
          disponível quatro tipos de campos, como: Texto, Número, Data e
          Seleção.
          <br />
          Exemplos, você pode criar um modelo para pessoas com os dados: Nome =
          Campo de Texto, Idade = Campo de Número, Sexo = Campo de Seleção com
          as suas respectivas opções, Data de Nascimento = Campo de Data.
          <br />
          Insira as informações corretamente, caso necessário na aba Edição de
          Modelos, você consegue editar o modelo que criou.
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <span className="text-muted-foreground">
          Primeiramente selecione o setor:
        </span>
        <SectorSelect
          sectors={sectors}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
        />
        {selectedSector ? (
          <>
            <span className="text-muted-foreground">
              Agora insira um nome para o modelo:{" "}
            </span>
            <Input
              className="text-center w-72"
              type="text"
              placeholder="Nome do modelo"
              value={modelName}
              autoComplete="off"
              onChange={(e) => setModelName(e.target.value)}
            />
          </>
        ) : null}
      </div>
      {modelName ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <span className="text-muted-foreground">Qual o nome do campo?</span>
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4">
              <div className="flex flex-col md:flex-row gap-2 text-justify">
                <Input
                  className="w-auto"
                  type="text"
                  placeholder="Nome do campo"
                  value={newField.value}
                  onChange={(e) =>
                    setNewField({ ...newField, value: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <Select
                    required
                    value={newField.type}
                    onValueChange={(value: FieldType) =>
                      setNewField({ ...newField, type: value })
                    }
                  >
                    <SelectTrigger className="w-60">
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
                  <Button
                    className="bg-emerald-800 hover:bg-emerald-700 text-white"
                    size={"icon"}
                    onClick={handleAddField}
                    disabled={!newField.value}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </div>
            </div>
            {newField.type === "select" && (
              <div className="flex md:flex-row flex-col gap-2 items-center">
                <span className="text-muted-foreground">
                  Adicione opções para o campo:
                </span>
                <div className="flex flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="Digite uma opção"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    disabled={newField.type !== "select"}
                    className="w-60"
                  />
                  <Button
                    className="bg-emerald-800 hover:bg-emerald-700 text-white"
                    onClick={handleAddOption}
                    size={"icon"}
                    disabled={!newOption || newField.type !== "select"}
                  >
                    <PlusIcon />
                  </Button>
                  {newField.options && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <Eye />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto flex flex-col gap-2">
                        {newField.options?.map((option) => (
                          <div
                            key={option.id}
                            className="flex gap-2 items-center"
                          >
                            <span className="w-44 text-center">
                              {option.value}
                            </span>
                            <Button
                              variant="destructive"
                              size={"icon"}
                              onClick={() => handleDeleteOption(option.id)}
                            >
                              <TrashIcon />
                            </Button>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            )}
          </div>
          {modelName && (
            <div className="flex flex-col gap-4 mt-20">
              <div className="flex flex-col gap-2 text-justify">
                <h1 className="text-2xl font-bold">
                  Verifique na tabela abaixo os campos criados:
                </h1>
                <span className="text-sm text-muted-foreground">
                  Caso esteja tudo correto, não se esqueça de clicar em salvar
                  antes de sair da aba, caso contrário perderá todo o modelo
                  criado.
                </span>
              </div>
              <ScrollArea className="w-full lg:h-[23vh] xl:h-[30vh] overflow-y-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Excluir</TableHead>
                      {fields.some((field) => field.type === "select") && (
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
                          <Button
                            variant="ghost"
                            onClick={() => handleDeleteField(field.id)}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </Button>
                        </TableCell>
                        {field.type === "select" && (
                          <TableCell>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Opções" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {field.options?.map((option) => (
                                    <SelectItem
                                      key={option.id}
                                      value={option.value}
                                    >
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
            </div>
          )}
        </div>
      ) : null}
      <div className="">
        <Button
          onClick={handleSubmit}
          disabled={!modelName || !selectedSector || fields.length === 0}
        >
          Salvar Modelo
        </Button>
      </div>
    </div>
  );
};
