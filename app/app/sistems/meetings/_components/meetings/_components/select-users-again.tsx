"use client";

import type { UserToMeeting } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  getUsers,
  updateUsersOnMeeting,
} from "../../../_actions/meetings-actions";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SelectUsersAgainProps {
  meetingId: string;
  onUpdate: (meetingId: string) => void;
}

export const SelectUsersAgain = ({
  meetingId,
  onUpdate,
}: SelectUsersAgainProps) => {
  const { toast } = useToast();
  const [allUsers, setAllUsers] = useState<UserToMeeting[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserToMeeting[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Obtém todos os usuários e define o estado
  const getAllUsers = async () => {
    const users = await getUsers();
    if (users) {
      const formattedUsers = users.map((user) => ({
        ...user,
        name: user.name || "Usuário Desconhecido",
      }));
      setAllUsers(formattedUsers);
    }
  };

  // Alterna a seleção de um usuário
  const handleSelectUser = (user: UserToMeeting) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  // Atualiza os usuários na reunião
  const handleUpdateUsersOnMeeting = async () => {
    const res = await updateUsersOnMeeting(meetingId, selectedUsers);
    if (res === true) {
      toast({
        title: "Usuários atualizados com sucesso!",
        description: "Termine as configurações...",
        variant: "success",
      });
      onUpdate(meetingId);
    } else {
      toast({
        title: "Erro ao atualizar os usuários",
        description: "Tente novamente...",
        variant: "destructive",
      });
    }
  };

  // Filtra os usuários com base no termo de busca
  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Selecione novamente os colaboradores...
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar seleção</DialogTitle>
          <DialogDescription>
            Use o campo abaixo para pesquisar e selecionar usuários.
          </DialogDescription>
        </DialogHeader>

        {/* Campo de pesquisa */}
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
          placeholder="Pesquisar usuário..."
        />

        {/* Área de rolagem com a lista de usuários */}
        <ScrollArea className="w-full h-[20vh] overflow-y-auto">
          <div className="flex flex-col w-full gap-2 px-6 py-2">
            {filteredUsers.map((user) => (
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
            <Button
              type="button"
              onClick={handleUpdateUsersOnMeeting}
              className="w-full"
            >
              Salvar mudanças
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
