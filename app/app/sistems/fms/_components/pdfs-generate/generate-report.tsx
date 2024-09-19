"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  GetFilesByFieldIds,
  GetHeaders,
} from "@/app/app/sistems/fms/_actions/fms-actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface GenerateReportProps {
  selectedFiles: string[];
}

interface CustomHeader {
  id: string;
  fieldLabel: string;
}

export const GenerateReport: React.FC<GenerateReportProps> = ({
  selectedFiles,
}) => {
  const [headers, setHeaders] = useState<CustomHeader[]>([]);
  const [files, setFiles] = useState<Record<string, string | undefined>[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchHeaders = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsLoading(true);
    try {
      const response = await GetHeaders(selectedFiles[0]);
      if (!response) throw new Error("No headers found");

      setHeaders(response);
      const headerIds = response.map((header) => header.id);
      const fileData = await GetFilesByFieldIds(headerIds);
      setFiles(fileData);
      setSelectedRows(new Set(fileData.map((file) => file.id)));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch report data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedFiles, toast]);

  useEffect(() => {
    fetchHeaders();
  }, [fetchHeaders]);

  const handleRowSelection = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectedFilesData = useMemo(
    () => files.filter((file) => selectedRows.has(file.id)),
    [files, selectedRows]
  );

  const handleGenerateReport = useCallback(() => {
    // Implement report generation logic here
    console.log("Generating report for:", selectedFilesData);
    toast({
      title: "Success",
      description: "Report generated successfully",
      variant: "success",
    });
  }, [selectedFilesData, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={selectedFiles.length === 0}>Gerar Relatórios</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Lista dos valores selecionados</AlertDialogTitle>
          <AlertDialogDescription>
            Verifique e se necessário exclua algum item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="h-[60vh] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                {headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap text-center"
                  >
                    {header.fieldLabel}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(file.id)}
                      onCheckedChange={() => handleRowSelection(file.id)}
                    />
                  </TableCell>
                  {headers.map((header) => (
                    <TableCell
                      key={header.id}
                      className="whitespace-nowrap text-center"
                    >
                      {file[header.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleGenerateReport}>
            Gerar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
