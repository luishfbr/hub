"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoveLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getUserId } from "../../_actions/meetings-actions";
import type { UserToMeeting } from "@/app/types/types";
import { CreateMeeting } from "../newMeeting/create-new-meeting";
import { CheckboxUsers } from "./_components/checkbox-users";

interface FormNewMeetingProps {
  selectedDate: Date | null;
  onSetName: (name: string) => void;
  meetingCreated: () => void;
}

export const FormNewMeeting = ({
  selectedDate,
  onSetName,
  meetingCreated,
}: FormNewMeetingProps) => {
  const [meetingName, setMeetingName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<UserToMeeting[]>([]);
  const [id, setId] = useState<string | null>(null);

  const getUserIdSession = async () => {
    try {
      const userId = await getUserId();
      setId(userId as string);
    } catch (error) {
      console.error("Failed to get user ID", error);
    }
  };

  const formattedDate = selectedDate?.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const data = {
    name: meetingName,
    date: formattedDate || "",
    users: selectedUsers,
    createdBy: id || "",
  };

  const handleSelectUser = (data: UserToMeeting[]) => {
    setSelectedUsers(data);
  };

  useEffect(() => {
    getUserIdSession();
  }, []);

  const onMeetingCreated = () => {
    setMeetingName("");
    meetingCreated();
  };

  const handleMeetingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setMeetingName(name);
    onSetName(name);
  };

  if (!selectedDate) {
    return (
      <Card className="p-6">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-center items-center gap-2">
            <MoveLeft className="h-5 w-5" />
            <span className="text-sm text-muted-foreground">
              Selecione uma data ao lado
            </span>
          </div>
          <Skeleton className="h-[15vh] w-full rounded-xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crie uma nova reunião</CardTitle>
        <CardDescription>
          Selecione o dia, nome da reunião e os usuários que participarão.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Input type="text" value={formattedDate || ""} disabled />
          <Input
            name="meetingName"
            value={meetingName}
            autoComplete="off"
            onChange={handleMeetingNameChange}
            type="text"
            placeholder="Nome da Reunião"
          />
          <div className="flex w-full gap-2">
            <CheckboxUsers
              meetingName={meetingName}
              onSelectUser={handleSelectUser}
            />
            <CreateMeeting data={data} onMeetingCreated={onMeetingCreated} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
