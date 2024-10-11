"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  GetFilesByFieldIds,
  GetHeadersByFileTemplateId,
  GetModelsById,
  GetUser,
} from "@/app/app/sistems/fms/_actions/fms-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { MenuComponent } from "../menu/menu-component";
import { GenerateReport } from "../pdfs-generate/generate-report";
import { GenerateLabels } from "../pdfs-generate/generate-labels";
import { DeleteSelectedArchives } from "../delete-all/delete-selected-archives";
import { Loader2 } from "lucide-react";

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
  const [role, setRole] = useState<string>("");

  const fetchRole = useCallback(async () => {
    const res = await GetUser();
    if (res) {
      setRole(res.role);
    }
  }, []);

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

  const getHeaders = useCallback(
    async (fileTemplateId: string) => {
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
    },
    [toast]
  );

  const getFiles = useCallback(
    async (fieldIds: string[]) => {
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
    },
    [toast]
  );

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
    fetchRole();
  }, [modelId, fetchData, fetchRole]);

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

  const attDataResetSelectedFiles = () => {
    setSelectedFiles([]);
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <GenerateReport selectedFiles={selectedFiles} />
          {role === "CREATOR" || role === "ADMIN" ? (
            <DeleteSelectedArchives
              selectedFiles={selectedFiles}
              onDelete={attDataResetSelectedFiles}
            />
          ) : null}
          <GenerateLabels selectedFiles={selectedFiles} />
        </div>
      )}

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
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
              <TableHead key={field.id}>{field.fieldLabel}</TableHead>
            ))}
            {role === "CREATOR" || role === "ADMIN" ? (
              <TableHead>Ações</TableHead>
            ) : null}
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredFiles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={fields.length + 2}
                className="text-muted-foreground text-center"
              >
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
                  <TableCell key={field.id}>
                    {fileRow[field.id] || "-"}
                  </TableCell>
                ))}
                {role === "CREATOR" || role === "ADMIN" ? (
                  <TableCell className="sticky right-0 bg-background z-10">
                    <div className="flex justify-center items-center">
                      <MenuComponent
                        fileId={fileRow.id || ""}
                        onUpdate={fetchData}
                      />
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
