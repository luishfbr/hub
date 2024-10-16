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
import { Loader2 } from "lucide-react";

export const GenerateLabels: React.FC<GenerateReportProps> = ({
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

  const handleGenerateLabels = useCallback(() => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const labelWidth = (pageWidth - margin * 3) / 2;
    const labelHeight = 60;
    let x = margin;
    let y = margin;

    files.forEach((file, index) => {
      const tableData = headers.map((header) => [
        header.fieldLabel,
        file[header.id] || "",
      ]);

      autoTable(doc, {
        startY: y,
        head: [["Campo", "Valor"]],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 1,
          halign: "center",
          fillColor: [255, 255, 255],
          textColor: "#000000",
          lineColor: "#000000",
          lineWidth: 0.1,
        },
        columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 50 } },
        margin: { left: x + (labelWidth - 80) / 2 },
      });

      if (index % 2 === 0) {
        x += labelWidth + margin;
      } else {
        x = margin;
        y +=
          (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
            .finalY -
          y +
          margin;
      }

      if (y + labelHeight > pageHeight - margin) {
        doc.addPage();
        x = margin;
        y = margin;
      }
    });

    doc.save(`etiquetas-${new Date().toLocaleDateString()}.pdf`);

    toast({
      title: "Sucesso",
      description: "Etiquetas geradas com sucesso",
      variant: "success",
    });
  }, [headers, files, toast]);

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="animate-spin" />
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={selectedFiles.length === 0}>Gerar Etiquetas</Button>
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
          <AlertDialogAction onClick={handleGenerateLabels}>
            Gerar PDF
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
