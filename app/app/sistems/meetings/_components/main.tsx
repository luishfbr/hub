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
import { useEffect, useState } from "react";
import {
  getMeetingsByUserId,
  getUsersOnMeeting,
} from "../_actions/meetings-actions";
import type { Meeting, UserToMeeting } from "@/app/types/types";
import { List, Loader2, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MeetingProps {
  id: string;
  updateMeetings: boolean;
}

export function Main({ id, updateMeetings }: MeetingProps) {
  const [infos, setInfos] = useState<Meeting[]>([]);
  const [user, setUser] = useState<UserToMeeting | null>(null);
  const [usersOnMeeting, setUsersOnMeeting] = useState<UserToMeeting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMeetings = async (id: string) => {
    setIsLoading(true);
    const meetings = await getMeetingsByUserId(id);
    setInfos(meetings.meetings);
    setUser(meetings.user);
    setIsLoading(false);
  };

  const fetchUsersOnMeeting = async (id: string) => {
    const res = await getUsersOnMeeting(id);
    if (res) {
      setUsersOnMeeting(res);
    }
  };

  useEffect(() => {
    fetchMeetings(id);
  }, [id, updateMeetings]);

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
                  {infos.map((meeting, index) => (
                    <TableRow key={index}>
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
                          <PopoverContent className="w-80">
                            {usersOnMeeting ? (
                              <div className="flex flex-col gap-2">
                                {usersOnMeeting.map((user, index) => (
                                  <div
                                    key={index}
                                    className="w-full flex gap-2"
                                  >
                                    <span className="text-muted-foreground">
                                      {user.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex justify-center items-center h-[50vh]">
                                <Loader2 className="animate-spin w-8 h-8" />
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="text-center text-nowrap items-center justify-center gap-2 flex">
                        <Button variant="ghost" size={"icon"}>
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size={"icon"}>
                          <Trash />
                        </Button>
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
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
