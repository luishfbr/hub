"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  GetFilesByFieldIds,
  GetHeadersByFileTemplateId,
  GetModelsById,
  deleteFile,
} from "@/app/app/sistems/fms/_actions/fms-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { MenuComponent } from "../menu/menu-component";
import { GenerateReport } from "../pdfs-generate/generate-report";
import { GenerateLabels } from "../pdfs-generate/generate-labels";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Field {
  id: string;
  fieldLabel: string;
  fieldType: string;
}

export const TableContainer = ({
  modelId,
  searchTerm,
}: {
  modelId: string;
  searchTerm: string;
}) => {
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [files, setFiles] = useState<Record<string, string | undefined>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const getModel = useCallback(async () => {
    try {
      const response = await GetModelsById(modelId);
      return response;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar informações do arquivo",
        variant: "destructive",
      });
    }
  }, [modelId, toast]);

  const getHeaders = useCallback(async (fileTemplateId: string) => {
    try {
      const response = await GetHeadersByFileTemplateId(fileTemplateId);
      if (response) {
        setFields(response as Field[]);
        return response.map((field: Field) => field.id);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar informações do arquivo",
        variant: "destructive",
      });
    }
  }, [toast]);

  const getFiles = useCallback(async (fieldIds: string[]) => {
    try {
      const response = await GetFilesByFieldIds(fieldIds);
      if (response) {
        setFiles(response);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar informações do arquivo",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const modelData = await getModel();
      if (modelData) {
        const fieldIds = await getHeaders(modelData.id);
        if (fieldIds) {
          await getFiles(fieldIds);
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar informações do arquivo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getModel, getHeaders, getFiles, toast]);

  useEffect(() => {
    fetchData();
  }, [modelId, fetchData]);

  const filteredFiles = useMemo(() => {
    return files.filter((fileRow) =>
      Object.values(fileRow).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [files, searchTerm]);

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.includes(fileId)
        ? prevSelectedFiles.filter((id) => id !== fileId)
        : [...prevSelectedFiles, fileId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      for (const fileId of selectedFiles) {
        await deleteFile(fileId);
      }
      toast({
        title: "Sucesso",
        description: "Arquivos deletados com sucesso",
        variant: "success",
      });
      setSelectedFiles([]);
      fetchData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar arquivos",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  return (
    <div className="max-h-[69vh] overflow-y-auto">
      <div className="flex justify-center mb-4">
        {selectedFiles.length > 0 && (
          <div className="flex gap-6">
            <GenerateReport selectedFiles={selectedFiles} />
            <Button onClick={handleDeleteSelected} variant="destructive">
              Excluir Selecionados
            </Button>
            <GenerateLabels selectedFiles={selectedFiles} />
          </div>
        )}
      </div>
      <ScrollArea className="w-full overflow-auto">
        <div className="min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center sticky left-0 bg-background z-20">
                  <Checkbox
                    checked={selectedFiles.length === filteredFiles.length}
                    onCheckedChange={(checked) =>
                      setSelectedFiles(
                        checked
                          ? filteredFiles
                            .map((file) => file.id)
                            .filter((id): id is string => id !== undefined)
                          : []
                      )
                    }
                  />
                </TableHead>
                {fields.map((field) => (
                  <TableHead className="text-center whitespace-nowrap" key={field.id}>
                    {field.fieldLabel}
                  </TableHead>
                ))}
                <TableHead className="text-center sticky right-0 bg-background z-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={fields.length + 2} className="text-center">
                    Nenhum resultado encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredFiles.map((fileRow, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="text-center sticky left-0 bg-background z-10">
                      <Checkbox
                        checked={selectedFiles.includes(fileRow.id || "")}
                        onCheckedChange={() => handleSelectFile(fileRow.id || "")}
                      />
                    </TableCell>
                    {fields.map((field) => (
                      <TableCell key={field.id} className="text-center whitespace-nowrap">
                        {fileRow[field.id] || "-"}
                      </TableCell>
                    ))}
                    <TableCell className="sticky right-0 bg-background z-10">
                      <div className="flex justify-center items-center">
                        <MenuComponent
                          fileId={fileRow.id || ""}
                          onUpdate={fetchData}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
