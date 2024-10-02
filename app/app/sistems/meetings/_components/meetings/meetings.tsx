import type { Meeting, UserToMeeting } from "@/app/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import {
  deleteMeeting,
  getMeetings,
  getUsersOnMeeting,
} from "../../_actions/meetings-actions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ListMeetingsProps {
  refreshMeetings: boolean;
}

export const ListMeetings = ({ refreshMeetings }: ListMeetingsProps) => {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [usersOnMeeting, setUsersOnMeeting] = useState<UserToMeeting[]>([]);

  const handleDelete = async (id: string) => {
    const res = await deleteMeeting(id);
    if (res === true) {
      toast({
        title: "Reunião deletada com sucesso!",
        description: "Fique de olho no seu email...",
        variant: "success",
      });
      AllMeetings();
    } else {
      toast({
        title: "Ocorreu um erro ao deletar a reunião!",
        description: "Tente novamente...",
        variant: "destructive",
      });
    }
    AllMeetings();
  };

  const getListUsersOnMeeting = async (id: string) => {
    const users = await getUsersOnMeeting(id);
    if (users) {
      setUsersOnMeeting(users);
    }
  };

  const AllMeetings = async () => {
    const meetings = await getMeetings();
    setMeetings(meetings);
  };

  const handleDeleteUserFromMeeting = async (id: string, meetingId: string) => {
    const del = await deleteUserFromMeeting(id, meetingId);
  };

  useEffect(() => {
    AllMeetings();
  }, [refreshMeetings]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Reuniões</CardTitle>
        <CardDescription>Inclua acima uma nova reunião.</CardDescription>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-col gap-2">
          {meetings.map((meeting, index) => (
            <div key={index} className="w-full flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => getListUsersOnMeeting(meeting.id)}
                    variant={"outline"}
                    className="w-full"
                  >
                    {meeting.name} - {meeting.date}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Tudo sobre a reunião:{" "}
                      <span className="text-muted-foreground font-bold">
                        {meeting.name}
                      </span>
                    </DialogTitle>
                    <DialogDescription>
                      Aqui você consegue ver todas as informações da reunião,
                      bem como o relatório gerado pelo sistema.
                    </DialogDescription>
                  </DialogHeader>
                  <form action="" className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="pl-2">Data da reunião:</Label>
                        <Input type="text" defaultValue={meeting.date} />
                      </div>
                      <div>
                        <Label className="pl-2">Nome da reunião:</Label>
                        <Input type="text" defaultValue={meeting.name} />
                      </div>
                    </div>
                    <div>
                      <Button
                        variant={"outline"}
                        type="button"
                        className="w-full"
                      >
                        Incluir novo colaborador
                      </Button>
                    </div>
                    <ScrollArea>
                      <Card className="p-2 gap-2 flex flex-col">
                        {usersOnMeeting.map((user, index) => (
                          <div key={index} className="flex gap-2">
                            <Button type={"button"} className="w-full">
                              {user.name}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                  <Trash />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Realmente deseja excluir o usuário?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Ao clicar em Confirmar, o usuário será
                                    excluído permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteUserFromMeeting(
                                        user.id,
                                        meeting.id
                                      )
                                    }
                                  >
                                    Continuar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}
                      </Card>
                    </ScrollArea>
                    <div>
                      <Button variant={"edit"} className="w-full">
                        Salvar alteranças
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Você tem certeza que deseja excluir a reunião?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Ao clicar em Confirmar, a reunião será excluída
                      permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(meeting.id)}>
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};
