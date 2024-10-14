"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, MoreVertical, Trash } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
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
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteFile,
  getFileById,
  updateFile,
} from "../../_actions/fms-actions";

export interface FileInfo {
  value: string;
  id: string;
  fieldId: string;
  field?: {
    fieldType: string;
    fieldLabel: string;
  };
}

interface MenuComponentProps {
  fileId: string;
  onUpdate: () => void;
}

export function MenuComponent({ fileId, onUpdate }: MenuComponentProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!fileId) {
      toast({
        title: "Erro",
        description: "Erro: ID do arquivo não fornecido",
        variant: "destructive",
      });
      return;
    }
    setIsDeleting(true);
    try {
      const response = await deleteFile(fileId);
      if (response) {
        toast({
          title: "Sucesso",
          description: "Arquivo deletado com sucesso",
          variant: "success",
        });
        onUpdate();
      } else {
        throw new Error("Falha na resposta do servidor");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar arquivo",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [fileId, toast, onUpdate]);

  const handleGetInfosForEdit = useCallback(async () => {
    try {
      const response = await getFileById(fileId);
      if (response) {
        setFileInfos(response);
        setIsEditing(true);
      } else {
        throw new Error("Falha ao obter informações do arquivo");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar informações do arquivo",
        variant: "destructive",
      });
    }
  }, [fileId, toast]);

  const handleSaveEdit = useCallback(async () => {
    setIsSaving(true);
    try {
      const updatedFileInfos = fileInfos.map((info) => ({
        ...info,
        value:
          (document.getElementById(info.id) as HTMLInputElement)?.value ||
          info.value,
      }));

      await updateFile(fileId, updatedFileInfos);
      setIsEditing(false);
      onUpdate();
      toast({
        title: "Sucesso",
        description: "Alterações salvas com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar as alterações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [fileId, fileInfos, onUpdate, toast]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <div className="flex flex-col">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="justify-start">
                <Trash className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente
                  o arquivo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                onClick={handleGetInfosForEdit}
                variant="ghost"
                className="justify-start"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editar arquivo</DialogTitle>
                <DialogDescription>
                  Faça as alterações necessárias no arquivo aqui. Clique em
                  salvar quando terminar.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
              >
                {fileInfos.map((fileInfo) => (
                  <div className="m-2" key={fileInfo.id}>
                    <Label htmlFor={fileInfo.id}>
                      {fileInfo.field?.fieldLabel || "Campo"}
                    </Label>
                    <Input
                      id={fileInfo.id}
                      defaultValue={fileInfo.value}
                      type={
                        fileInfo.field?.fieldType === "number"
                          ? "number"
                          : "text"
                      }
                    />
                  </div>
                ))}
                <DialogFooter>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}
