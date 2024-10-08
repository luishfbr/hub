"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  GetFilesByFieldIds,
  GetHeadersByFileTemplateId,
  GetModelsById,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { MenuComponent } from "../menu/menu-component";
import { GenerateReport } from "../pdfs-generate/generate-report";
import { GenerateLabels } from "../pdfs-generate/generate-labels";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeleteSelectedArchives } from "../delete-all/delete-selected-archives";
import styles from "@/app/styles/main.module.css";

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

  const attDataResetSelectedFiles = () => {
    setSelectedFiles([]);
    fetchData();
  };

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <GenerateReport selectedFiles={selectedFiles} />
          <DeleteSelectedArchives
            selectedFiles={selectedFiles}
            onDelete={attDataResetSelectedFiles}
          />
          <GenerateLabels selectedFiles={selectedFiles} />
        </div>
      )}

      <div className="w-full overflow-auto">
        <ScrollArea className="h-[37vh] md:h-[59vh] lg:h-[63vh] xl:h-[69vh]">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className={`${styles.head} sticky left-0 z-10`}>
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
                  <TableHead className={styles.head} key={field.id}>
                    {field.fieldLabel}
                  </TableHead>
                ))}
                <TableHead className={styles.head}>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="overflow-auto">
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
                        onCheckedChange={() =>
                          handleSelectFile(fileRow.id || "")
                        }
                      />
                    </TableCell>
                    {fields.map((field) => (
                      <TableCell key={field.id} className={styles.head}>
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
        </ScrollArea>
      </div>
    </div>
  );
};
