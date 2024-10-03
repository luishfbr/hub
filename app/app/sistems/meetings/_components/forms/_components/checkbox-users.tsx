"use client";

import type { UserToMeeting } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { getUsers } from "../../../_actions/meetings-actions";

interface CheckboxUsersProps {
  meetingName: string;
  onSelectUser: (data: UserToMeeting[]) => void;
}

export const CheckboxUsers = ({
  meetingName,
  onSelectUser,
}: CheckboxUsersProps) => {
  const [users, setUsers] = useState<UserToMeeting[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserToMeeting[]>([]);

  const handleSelectUser = (user: UserToMeeting) => {
    setSelectedUsers((prev) => {
      const newSelectedUsers = prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user];

      onSelectUser(newSelectedUsers);
      return newSelectedUsers;
    });
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      const formattedUsers = res.map((user) => ({
        name: user.name as string,
        id: user.id as string,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
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
  );
};
