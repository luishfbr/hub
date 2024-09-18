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

interface Field {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(10);
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
  }, [modelId]);

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
  }, []);

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
  }, []);

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
  }, [getModel, getHeaders, getFiles]);

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

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        {selectedFiles.length > 0 && (
          <Button onClick={handleDeleteSelected} variant="destructive">
            Excluir Selecionados
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">
              <Checkbox
                checked={selectedFiles.length === currentFiles.length}
                onCheckedChange={(checked) =>
                  setSelectedFiles(
                    checked
                      ? currentFiles
                          .map((file) => file.id)
                          .filter((id): id is string => id !== undefined)
                      : []
                  )
                }
              />
            </TableHead>
            {fields.map((field) => (
              <TableHead className="text-center" key={field.id}>
                {field.fieldLabel}
              </TableHead>
            ))}
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentFiles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={fields.length + 2} className="text-center">
                Nenhum resultado encontrado
              </TableCell>
            </TableRow>
          ) : (
            currentFiles.map((fileRow, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedFiles.includes(fileRow.id || "")}
                    onCheckedChange={() => handleSelectFile(fileRow.id || "")}
                  />
                </TableCell>
                {fields.map((field) => (
                  <TableCell key={field.id} className="text-center">
                    {fileRow[field.id] || "-"}
                  </TableCell>
                ))}
                <TableCell className="flex justify-center items-center">
                  <MenuComponent
                    fileId={fileRow.id || ""}
                    onUpdate={fetchData}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {filteredFiles.length > filesPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from(
            { length: Math.ceil(filteredFiles.length / filesPerPage) },
            (_, index) => (
              <Button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                variant={currentPage === index + 1 ? "default" : "outline"}
                className="mx-1"
              >
                {index + 1}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
};
