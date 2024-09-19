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
import { GetSectors } from "../../_actions/fms-actions";
import { Sector } from "@/app/types/types";
import { SectorSelect } from "../new-model/_components/sector-select";

export function ImportModel() {
    const { toast } = useToast();
    const [headers, setHeaders] = useState<string[]>([]);
    const [rows, setRows] = useState<string[][]>([]);
    const [fileName, setFileName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [sectors, setSectors] = useState<Sector[]>([]);

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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsLoading(true);
            setFileName(file.name);
            const workbook = new ExcelJS.Workbook();
            try {
                await workbook.xlsx.load(await file.arrayBuffer());
                const worksheet = workbook.worksheets[0];
                if (worksheet) {
                    const headerRow = worksheet.getRow(1);
                    const headerValues = headerRow.values as string[];
                    setHeaders(headerValues.filter((header): header is string => typeof header === "string"));

                    const data: string[][] = [];
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber > 1) {
                            const rowData = row.values as string[];
                            data.push(rowData.slice(1));
                        }
                    });
                    setRows(data);
                }
            } catch (error) {
                console.error("Error reading Excel file:", error);
                toast({
                    title: "Erro",
                    description: "Ocorreu um erro ao ler o arquivo Excel. Por favor, tente novamente.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleImport = () => {
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
                    <div className="flex flex-col gap-2 items-center justify-center w-full">
                        <Input
                            id="excel-file-input"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                            disabled={isLoading}
                            className="w-full sm:w-auto cursor-pointer"
                        />
                    </div>
                    {isLoading ? (
                        <div>Carregando...</div>
                    ) : (
                        headers.length > 0 && (
                            <Card className="w-full">
                                <CardContent className="p-4">
                                    <ScrollArea className="sm:max-h-[30vh] lg:max-h-[57vh] xl:max-h-[60vh] w-full">
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
                                                            <TableCell className="text-center" key={cellIndex}>{cell}</TableCell>
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
                    <Button onClick={handleImport} disabled={headers.length === 0 || isLoading}>
                        Importar
                    </Button>
                </div>
            )}
        </div>
    );
}
