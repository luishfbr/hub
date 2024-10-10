"use client";

import { ArchivesToShow, MeetingMod } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, File, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getArchivesOnMeeting, getMeetingById, registerArchives } from "../../_actions/meetings-actions";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DeleteArchive } from "./_components/delete-archive";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InsertFilesProps {
    meetingId: string;
    userId: string;
}

export const InsertFiles = ({ meetingId, userId }: InsertFilesProps) => {
    const [meeting, setMeeting] = useState<MeetingMod | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [fileURLs, setFileURLs] = useState<string[]>([]);
    const [archives, setArchives] = useState<ArchivesToShow[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const { toast } = useToast();

    const handleOpenChange = () => {
        setFiles([])
    }

    const typeToExtension = (type: string) => {
        switch (type) {
            case "image/png": return ".png";
            case "image/jpeg": return ".jpg";
            case "application/pdf": return ".pdf";
            default: return ".unknown";
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const acceptedFiles = selectedFiles.filter(
            (file) => ["application/pdf", "image/png", "image/jpeg"].includes(file.type)
        );

        setFiles(acceptedFiles);
        setFileURLs(acceptedFiles.map(file => URL.createObjectURL(file)));
    };

    const fetchMeeting = useCallback(async () => {
        const res = await getMeetingById(meetingId);
        if (res) {
            setMeeting(res);
        }
    }, [meetingId]);

    function onDelete() {
        fetchArchivesOnMeeting()
    }

    const fetchArchivesOnMeeting = useCallback(async () => {
        const res = await getArchivesOnMeeting(meetingId, userId);
        if (res) {
            setArchives(res);
        }
    }, [meetingId, userId]);

    const handleRegisterArchives = async () => {
        setIsUploading(true);
        try {
            const data = {
                meetingId: meetingId,
                createdBy: userId,
                data: fileURLs.join(","),
            };

            if (!data.meetingId || !data.createdBy || !data.data) {
                toast({
                    title: "Erro ao registrar arquivos",
                    description: "Por favor, selecione uma reunião e carregue os arquivos corretamente.",
                    variant: "destructive",
                });
                return;
            }

            const res = await registerArchives(data);
            if (res) {
                toast({
                    title: "Arquivos registrados com sucesso!",
                    description: "Verifique o seu e-mail para mais informações.",
                    variant: "success",
                });
                setFiles([]);
                setFileURLs([]);
                fetchArchivesOnMeeting();
            }
        } catch (error) {
            toast({
                title: "Erro ao registrar arquivos",
                description: "Não foi possível registrar os arquivos. Tente novamente mais tarde.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        fetchMeeting();
        fetchArchivesOnMeeting();
    }, [fetchArchivesOnMeeting, fetchMeeting]);

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size={"icon"}>
                    <File />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[80vw]">
                <DialogHeader>
                    <DialogTitle>Seus arquivos para a reunião: {meeting?.name}</DialogTitle>
                    <DialogDescription>
                        Insira novos arquivos e verifique aqueles que já foram inseridos por você.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Input type="file" accept=".pdf, .png, .jpg" multiple onChange={handleFileChange} />
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Arquivos selecionados</CardTitle>
                                <CardDescription>{files.length} arquivos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Tamanho</TableHead>
                                            <TableHead>Visualizar</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {files.map((file, index) => (
                                            <TableRow key={file.name}>
                                                <TableCell>{file.name}</TableCell>
                                                <TableCell>{typeToExtension(file.type)}</TableCell>
                                                <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                                                <TableCell className="flex justify-center">
                                                    <a href={fileURLs[index]} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="cursor-pointer" />
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Arquivos já inseridos</CardTitle>
                                <CardDescription>
                                    Verifique se todos os arquivos necessários estão inseridos.
                                </CardDescription>
                                <CardContent>
                                    <ScrollArea className="h-60">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>#</TableHead>
                                                    <TableHead>Arquivo</TableHead>
                                                    <TableHead>Excluir</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody >
                                                {archives.map((archive, index) => (
                                                    <TableRow key={index} >
                                                        <TableCell>
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant={"ghost"} size={"icon"}>
                                                                <a href={archive.data} target="_blank" rel="noopener noreferrer">
                                                                    <Eye className="cursor-pointer" />
                                                                </a>
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <DeleteArchive archiveId={archive.id} onDelete={onDelete} />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </CardContent>
                            </CardHeader>
                        </Card>
                    </div>

                </div>
                <DialogFooter>
                    <Button onClick={handleRegisterArchives}>
                        {isUploading ? <Loader2 className="animate-spin w-6 h-6" /> : "Inserir Arquivos"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
