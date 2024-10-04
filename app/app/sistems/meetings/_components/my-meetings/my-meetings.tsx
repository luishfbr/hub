"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Meeting, UserToMeeting } from "@/app/types/types";
import { getAllInfo, getUsersOnMeeting } from "../../_actions/meetings-actions";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MyMeetings = () => {
  const [user, setUser] = useState<UserToMeeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usersOnMeeting, setUsersOnMeeting] = useState<UserToMeeting[]>([]);

  const handleGetUsersOnMeeting = async (id: string) => {
    setIsLoading(true);
    const res = await getUsersOnMeeting(id);
    if (res) {
      setUsersOnMeeting(res);
      setIsLoading(false);
    }
  };

  const fetchAllInfo = async () => {
    setIsLoading(true);
    try {
      const res = await getAllInfo();
      if (res) {
        setUser(res.user);
        setMeetings(res.meetings);
      } else {
        setMeetings([]);
      }
    } catch (error) {
      setError("Erro ao carregar as informações");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <Card className="relative h-[50vh] p-4">
      <CardHeader>
        <CardTitle>Olá {user?.name}, suas reuniões...</CardTitle>
        <CardDescription>
          Acesse a reunião e veja o que cada usuário incluiu...
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6">
        <Card>
          <ScrollArea className="w-full h-[35vh] overflow-y-auto">
            <div className="flex flex-col items-center justify-center w-full gap-2">
              {meetings.length > 0 ? (
                <div className="w-full flex flex-col gap-2">
                  {meetings.map((meeting, index) => (
                    <Button
                      onClick={() => handleGetUsersOnMeeting(meeting.id)}
                      variant={"link"}
                      key={index}
                      className="w-full"
                    >
                      {meeting.name} - {meeting.date}
                    </Button>
                  ))}
                </div>
              ) : (
                <div>
                  <span>Você não tem nenhuma reunião criada</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
        <Card>
          <ScrollArea className="w-full h-[35vh] overflow-y-auto">
            <div className="flex flex-col items-center justify-center w-full gap-2">
              {usersOnMeeting.length > 0 ? (
                <div className="w-full flex flex-col gap-2">
                  {usersOnMeeting.map((user, index) => (
                    <Button variant={"link"} key={index} className="w-full">
                      {user.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <div>
                  <span>Nenhum usuário nessa reunião...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </CardContent>
    </Card>
  );
};
