"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react";
import {
  getMeetingsByUserId,
  getMeetingsPartingUser,
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
import { DeleteButtonMeetings } from "./button-meetings/delete-meetings";
import { EditMeetings } from "./button-meetings/edit-meetings";

interface MeetingProps {
  id: string;
  updateMeetings: boolean;
}

export function Main({ id, updateMeetings }: MeetingProps) {
  const [infos, setInfos] = useState<Meeting[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [user, setUser] = useState<UserToMeeting | null>(null);
  const [usersOnMeeting, setUsersOnMeeting] = useState<UserToMeeting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingUsers, setIsFetchingUsers] = useState<string | null>(null);

  const handleUpdate = useCallback(() => {
    fetchMeetings(id);
  }, [id]);

  const fetchMeetings = async (id: string) => {
    try {
      setIsLoading(true);
      const meetings = await getMeetingsByUserId(id);
      setInfos(meetings.meetings);
      setUser(meetings.user);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyMeetings = async () => {
    const res = await getMeetingsPartingUser(id);
    if (res) {
      setMeetings(res);
    }
  }

  const fetchUsersOnMeeting = async (meetingId: string) => {
    try {
      setIsFetchingUsers(meetingId);
      const res = await getUsersOnMeeting(meetingId);
      if (res) {
        setUsersOnMeeting(res);
      }
    } catch (error) {
      console.error("Error fetching users on meeting:", error);
    } finally {
      setIsFetchingUsers(null);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      fetchMeetings(id);
    }
    return () => {
      isSubscribed = false;
    };
  }, [id, updateMeetings, handleUpdate]);

  return (
    <div className="w-full grid gap-6 grid-cols-2 h-[75vh] md:h-[80vh] lg:h-[83vh] xl:h-[89vh]">
      <Card>
        <CardHeader>
          <CardTitle>
            Tabela de todas as reuniões criadas por você {user?.name}
          </CardTitle>
          <CardDescription>
            Aqui você possui controle total sobre todas as reuniões criadas por
            você, tome cuidado...
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : (
            <Table>
              <ScrollArea className="h-[70vh] w-full overflow-y-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center text-nowrap">
                      Nome da Reunião
                    </TableHead>
                    <TableHead className="text-center text-nowrap">
                      Data
                    </TableHead>
                    <TableHead className="text-center text-nowrap">
                      Colaboradores
                    </TableHead>
                    <TableHead className="text-center text-nowrap">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {infos.map((meeting) => (
                    <TableRow key={meeting.id}>
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
                              size={"icon"}
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
                                  <div
                                    key={user.id}
                                    className="w-full flex gap-2"
                                  >
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
                      <TableCell className="text-center text-nowrap items-center justify-center gap-2 flex">
                        <EditMeetings id={meeting.id} onUpdate={handleUpdate} />
                        <DeleteButtonMeetings
                          id={meeting.id}
                          onDelete={handleUpdate}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </ScrollArea>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reuniões que faço parte</CardTitle>
          <CardDescription>Você não consegue excluir reuniões neste campo, apenas conseguirá anexar arquivos a elas, para que o criador tenha controle do que você apresentará na mesma.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : (
            <Table>
              <ScrollArea className="h-[70vh] w-full overflow-y-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center text-nowrap">
                      Nome da Reunião
                    </TableHead>
                    <TableHead className="text-center text-nowrap">
                      Data
                    </TableHead>
                    <TableHead className="text-center text-nowrap">
                      Inserir Arquivos
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="text-center text-nowrap">
                        {meeting.name}
                      </TableCell>
                      <TableCell className="text-center text-nowrap">
                        {meeting.date}
                      </TableCell>
                      <TableCell className="flex items-center justify-center">
                        <File />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </ScrollArea>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
