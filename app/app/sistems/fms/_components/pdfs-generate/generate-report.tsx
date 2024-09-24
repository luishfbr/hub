"use client";

import { useEffect, useState, useCallback } from "react";
import {
  GetFileByCommonId,
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
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CustomHeader, GenerateReportProps } from "@/app/types/types";

export const GenerateReport: React.FC<GenerateReportProps> = ({
  selectedFiles,
}) => {
  const [headers, setHeaders] = useState<CustomHeader[]>([]);
  const [files, setFiles] = useState<Record<string, string | undefined>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchHeaders = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsLoading(true);
    try {
      const response = await GetHeaders(selectedFiles[0]);
      if (!response) throw new Error("No headers found");

      setHeaders(response.headers);
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

  const fetchFiles = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    const response = await GetFileByCommonId(selectedFiles);
    if (!response) throw new Error("No files found");

    setFiles(response);
  }, [selectedFiles]);

  useEffect(() => {
    fetchFiles();
    fetchHeaders();
  }, [fetchHeaders, fetchFiles]);

  const handleGenerateReport = useCallback(() => {
    const doc = new jsPDF("p", "mm", "a4");
    const tableColumn = headers.map((header) => header.fieldLabel);
    const tableRows = files.map((file) =>
      headers.map((header) => file[header.id] || "")
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8, halign: "center", valign: "middle" },
    });

    doc.save(`relatorio-${new Date().toLocaleDateString()}.pdf`);

    toast({
      title: "Sucesso",
      description: "Relatório gerado com sucesso",
      variant: "success",
    });
  }, [headers, files, toast]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={selectedFiles.length === 0}>Gerar Relatório</Button>
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
            Gerar PDF
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
