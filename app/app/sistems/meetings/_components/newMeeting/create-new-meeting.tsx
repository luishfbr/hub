import type { NewMeeting } from "@/app/types/types";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createNewMeeting } from "../../_actions/meetings-actions";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CreateMeetingProps {
  data: NewMeeting;
  onMeetingCreated: () => void;
}

export const CreateMeeting = ({
  data,
  onMeetingCreated,
}: CreateMeetingProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleCreateMeeting = async () => {
    setLoading(true);
    const res = await createNewMeeting(data);
    if (res === true) {
      toast({
        title: `Reunião: ${data.name} criada com sucesso!`,
        description: "Fique de olho no seu email...",
        variant: "success",
      });
      onMeetingCreated();
    } else {
      toast({
        title: "Ocorreu um erro ao criar a reunião!",
        description: "Tente novamente...",
        variant: "destructive",
      });
    }
    setLoading(false);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default">Criar reunião</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verifique as informações</AlertDialogTitle>
          <AlertDialogDescription>
            Caso esteja tudo correto, aperte em criar e pronto, será enviado um
            e-mail com todas as informações para os colaboradores selecionados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <p className="font-bold">Nome da Reunião:</p>
            <span className="text-muted-foreground">{data.name}</span>
          </div>
          <div className="flex gap-2">
            <p className="font-bold">Data da Reunião:</p>
            <span className="text-muted-foreground">{data.date}</span>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>
                <span className="text-muted-foreground">
                  Colaboradores da Reunião:
                </span>
              </CardTitle>
              <CardDescription>
                Se faltou algum, verifique antes e selecione na página anterior
                clicando no botão SELECIONE PARTICIPANTES
              </CardDescription>
            </CardHeader>
            <ScrollArea className="w-full h-[20vh] overflow-y-auto">
              <CardContent className="flex flex-col gap-2 text-center">
                {data.users.map((user, index) => (
                  <div key={index}>
                    <span className="text-muted-foreground">{user.name}</span>
                    <span className="text-muted-foreground"></span>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleCreateMeeting}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
