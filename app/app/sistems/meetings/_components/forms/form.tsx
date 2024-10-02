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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserId, getUsers } from "../../_actions/meetings-actions";
import type { UserToMeeting } from "@/app/types/types";
import { CreateMeeting } from "../newMeeting/create-new-meeting";

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
  const [users, setUsers] = useState<UserToMeeting[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserToMeeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [id, setId] = useState<string | null>(null);

  const getUserIdSession = async () => {
    const userId = await getUserId();
    setId(userId as string);
  };

  const formattedDate = selectedDate?.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const data = {
    name: meetingName as string,
    date: formattedDate as string,
    users: selectedUsers,
    createdBy: id as string,
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      const formattedUsers = res.map((user) => ({
        ...user,
        name: user.name ?? "Nome desconhecido",
        id: user.id as string,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    getUserIdSession();
  }, []);

  const onMeetingCreated = () => {
    meetingCreated();
  };

  const handleMeetingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setMeetingName(name);
    onSetName(name);
  };

  const handleSelectUser = (user: UserToMeeting) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[15vh] w-full rounded-xl" />
      </Card>
    );
  }

  if (!users.length) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Nenhum usuário encontrado.
          </span>
        </div>
      </Card>
    );
  }

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
          <Input
            type="text"
            value={selectedDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
            disabled
          />
          <Input
            name="meetingName"
            value={meetingName}
            autoComplete="off"
            onChange={handleMeetingNameChange}
            type="text"
            placeholder="Nome da Reunião"
          />
          <div className="flex w-full gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"secondary"}
                  className="w-full"
                  disabled={!meetingName}
                >
                  Selecione Participantes
                </Button>
              </DialogTrigger>
              <DialogContent className="w-96">
                <DialogHeader>
                  <DialogTitle>
                    Reunião:{" "}
                    <span className="text-muted-foreground">{meetingName}</span>
                  </DialogTitle>
                  <DialogDescription>
                    Selecione os usuários que participarão desta reunião.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="w-full h-[30vh] overflow-y-auto">
                  <div className="flex flex-col w-full gap-2 px-6 py-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedUsers.some((u) => u.id === user.id)}
                          onCheckedChange={() => handleSelectUser(user)}
                        />
                        <Label>{user.name}</Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <DialogClose>
                    <Button>Confirmar</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <CreateMeeting data={data} onMeetingCreated={onMeetingCreated} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
