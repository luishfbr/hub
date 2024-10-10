"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import {
  findCreator,
  getMeetingsPartingUser,
  getUserById,
  getUsersOnMeeting,
} from "../_actions/meetings-actions";
import type { Meeting, UserToMeeting } from "@/app/types/types";
import { File, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { InsertFiles } from "./insert-files/insertFiles";

interface MeetingProps {
  id: string;
  updateMeetings: boolean;
}

export function Main({ id, updateMeetings }: MeetingProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [user, setUser] = useState<UserToMeeting>();
  const [isFetchingUsers, setIsFetchingUsers] = useState<string | null>(null);
  const [usersOnMeeting, setUsersOnMeeting] = useState<UserToMeeting[]>([]);
  const [creatorsMap, setCreatorsMap] = useState<{ [key: string]: string | null }>({});

  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getMeetingsPartingUser(id);
      if (res) {
        setMeetings(res);

        const creatorPromises = res.map(async (meeting) => {
          const creator = await findCreator(meeting.createdBy);
          return { id: meeting.id, creatorName: creator ? creator.name : null };
        });

        const creators = await Promise.all(creatorPromises);
        const newCreatorsMap: { [key: string]: string | null } = {};
        creators.forEach(({ id, creatorName }) => {
          newCreatorsMap[id] = creatorName;
        });
        setCreatorsMap(newCreatorsMap);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchInfoUser = useCallback(async () => {
    const res = await getUserById(id);
    if (res) {
      setUser(res);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as informações do usuário, recarregue a página.",
        variant: "destructive",
      });
    }
  }, [id, toast]);

  const fetchUsersOnMeeting = async (id: string) => {
    setIsFetchingUsers(id);
    const res = await getUsersOnMeeting(id);
    if (res) {
      setUsersOnMeeting(res);
    }
    setIsFetchingUsers(null);
  };

  useEffect(() => {
    fetchInfoUser();
    fetchMeetings();
  }, [fetchInfoUser, fetchMeetings]);

  useEffect(() => {
    if (updateMeetings) {
      fetchMeetings();
    }
  }, [updateMeetings, fetchMeetings]);

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div>
        <h1 className="text-xl font-bold">
          Olá {user?.name}, abaixo as reuniões que você faz parte
        </h1>
        <span className="text-sm text-muted-foreground flex gap-2">
          Fique atento no seu email e verifique abaixo na linha <File className="w-4 h-4" /> se inseriu corretamente todos os arquivos em cada reunião que você foi convocado.
        </span>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center flex-grow">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : (

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-nowrap">
                Data de Criação
              </TableHead>
              <TableHead className="text-center text-nowrap">
                Criador por
              </TableHead>
              <TableHead className="text-center text-nowrap">
                Nome da Reunião
              </TableHead>
              <TableHead className="text-center text-nowrap">
                Data da Reunião
              </TableHead>
              <TableHead className="text-center text-nowrap">
                Participantes
              </TableHead>
              <TableHead className="text-center text-nowrap">
                Inserir Arquivos
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {meetings.length > 0 ? (
              meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell className="text-center text-nowrap">
                    {meeting.createdAt}
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    {creatorsMap[meeting.id] || "Desconhecido"}
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    {meeting.name}
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    {meeting.date}
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          onClick={() => fetchUsersOnMeeting(meeting.id)}
                          variant="ghost"
                          size="icon"
                        >
                          <List />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto">
                        {isFetchingUsers === meeting.id ? (
                          <div className="flex justify-center items-center">
                            <Loader2 className="animate-spin w-8 h-8" />
                          </div>
                        ) : usersOnMeeting.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {usersOnMeeting.map((user) => (
                              <div key={user.id} className="w-full flex gap-2">
                                <span className="text-muted-foreground">
                                  {user.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center">Nenhum usuário encontrado</div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <InsertFiles meetingId={meeting.id} userId={user?.id as string} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-sm text-muted-foreground">
                  Nenhuma reunião encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
