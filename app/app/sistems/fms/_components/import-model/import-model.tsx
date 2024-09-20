import { v4 as uuidv4 } from "uuid";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ExcelJS from "exceljs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  createNewModelByImporting,
  GetSectors,
} from "../../_actions/fms-actions";
import { Sector } from "@/app/types/types";
import { SectorSelect } from "../new-model/_components/sector-select";
import { DescriptionHelp } from "./_components/description";

export function ImportModel() {
  const { toast } = useToast();
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<(string | number | null)[][]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [rowsFormatted, setRowsFormatted] = useState<{ idRow: number }[]>([]);

  const fetchSectors = useCallback(async () => {
    try {
      const response = await GetSectors();
      if (response && response.sectors) {
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

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const nameFile = file.name.split(".")[0];
      setFileName(nameFile);
      const workbook = new ExcelJS.Workbook();
      try {
        await workbook.xlsx.load(await file.arrayBuffer());
        const worksheet = workbook.worksheets[0];

        const headers = (worksheet.getRow(1).values as (string | undefined)[])
          .slice(1)
          .filter(
            (value): value is string => value !== null && value !== undefined
          );
        setHeaders(headers);

        const rows = worksheet
          .getSheetValues()
          .slice(2)
          .map((row) =>
            Array.isArray(row)
              ? row.slice(1).map((cell) => (cell === undefined ? null : cell))
              : []
          );
        setRows(rows as (string | number | null)[][]);

        const formattedRows = rows.map((row, indexRow) => {
          const commonId = uuidv4();
          const formattedRow = row.reduce(
            (acc, cell, indexCell) => ({
              ...acc,
              [indexCell + 1]: { value: cell, commonId },
            }),
            {}
          );
          return { idRow: indexRow + 1, ...formattedRow };
        });

        setRowsFormatted(formattedRows);
      } catch (error) {
        toast({
          title: "Erro",
          description:
            "Ocorreu um erro ao ler o arquivo Excel. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImport = async () => {
    const formData = {
      modelName: fileName,
      sectorId: selectedSector as string,
      fields: headers,
    };

    const dataFiles = rowsFormatted;
    const res = await createNewModelByImporting(formData, dataFiles);
    
    toast({
      title: "Sucesso",
      description: "Modelo importado com sucesso!",
      variant: "success",
    });
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full">
      <SectorSelect
        sectors={sectors}
        selectedSector={selectedSector}
        setSelectedSector={handleSectorChange}
      />
      {selectedSector && (
        <div className="flex flex-col gap-6 items-center justify-center w-full">
          <Card className="p-2 grid grid-cols-3 gap-2">
            <Input
              id="excel-file-input"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="w-full sm:w-auto cursor-pointer"
            />
            <DescriptionHelp />
            <Input
              id="file-name-input"
              defaultValue={fileName}
              placeholder={fileName ? fileName : "Insira um arquivo"}
              className="text-center w-full sm:w-auto"
            />
          </Card>
          {isLoading ? (
            <div>Carregando...</div>
          ) : (
            headers.length > 0 && (
              <Card className="w-full">
                <CardContent className="p-4">
                  <ScrollArea className="h-[600px] sm:max-h-[30vh] lg:max-h-[57vh] xl:max-h-[60vh] w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {headers.map((header, index) => (
                            <TableHead className="text-center" key={index}>
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell
                                className="text-center"
                                key={cellIndex}
                              >
                                {cell !== null ? cell.toString() : ""}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            )
          )}
          <Button
            onClick={handleImport}
            disabled={headers.length === 0 || isLoading}
          >
            Importar
          </Button>
        </div>
      )}
    </div>
  );
}
