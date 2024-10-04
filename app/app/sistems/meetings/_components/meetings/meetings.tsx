"use client";

import type { Meeting } from "@/app/types/types";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { deleteMeeting, getMeetings } from "../../_actions/meetings-actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import { ReportList } from "./_components/report-list";
import { Skeleton } from "@/components/ui/skeleton";

export const ListMeetings = () => {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const handleDelete = async (id: string) => {
    const res = await deleteMeeting(id);

    if (res === true) {
      toast({
        title: "Reunião deletada com sucesso",
        variant: "success",
      });

      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.id !== id)
      );
    } else {
      toast({
        title: "Ocorreu um erro ao deletar a reunião",
        variant: "destructive",
      });
    }
  };

  const AllMeetings = async () => {
    const meetings = await getMeetings();
    setMeetings(meetings);
  };

  useEffect(() => {
    AllMeetings();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Reuniões</CardTitle>
        <CardDescription>Inclua acima uma nova reunião.</CardDescription>
      </CardHeader>
      {meetings.length > 0 ? (
        <ScrollArea>
          <CardContent className="flex flex-col gap-2">
            {meetings.map((meeting, index) => (
              <div key={index} className="w-full flex gap-2">
                <ReportList meetingId={meeting.id} onUpdate={AllMeetings} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size={"icon"}>
                      <Trash className="w-4 h-4 hover:text-muted-foreground" />
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
                      <AlertDialogAction
                        onClick={() => handleDelete(meeting.id)}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      ) : (
        <CardContent className="flex flex-col justify-center items-center">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </CardContent>
      )}
    </Card>
  );
};
