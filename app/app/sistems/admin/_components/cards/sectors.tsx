"use client";

import { CreateNewSector } from "./createSectors";
import { BadgeMinus, BadgePlus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  excludeUserToSectorById,
  getSectors,
  getUsersAlreadyHave,
  getUsersAndVerifySector,
  getUsersOnSectorById,
  includeUserToSectorById,
} from "./_actions/users";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DeleteButton } from "./_components/sectorsButtons/deleteButton";
import styles from "@/app/styles/main.module.css";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export type Sector = {
  id: string;
  name: string;
};

export type User = {
  name: string;
  email: string;
  role: string;
};

type ReturnedUser = {
  id: string;
  name: string | null;
};

export const CardSectors = () => {
  const { toast } = useToast();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [usersOnSector, setUsersOnSector] = useState<string[]>([]);
  const [users, setUsers] = useState<ReturnedUser[]>([]);
  const [usersHave, setUsersHave] = useState<ReturnedUser[]>([]);

  const fetchUsersHave = async (sectorId: string) => {
    const fetchedUsersHave = await getUsersAlreadyHave(sectorId);
    setUsersHave(fetchedUsersHave);
  };

  const fetchUsersNonHave = async (sectorId: string) => {
    const fetchedUsers = await getUsersAndVerifySector(sectorId);
    setUsers(fetchedUsers);
  };

  const includeUserToSector = async (userId: string, sectorId: string) => {
    try {
      await includeUserToSectorById(userId, sectorId);
      fetchData();
      toast({
        title: "Sucesso",
        description: "Usuário incluído com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error("Falha ao incluir usuário ao setor:", error);
      toast({
        title: "Erro",
        description: "Falha ao incluir usuário ao setor!",
        variant: "destructive",
      });
    }
  };

  const excludeUserToSector = async (userId: string, sectorId: string) => {
    try {
      await excludeUserToSectorById(userId, sectorId);
      fetchData();
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error("Falha ao excluir usuário do setor:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir usuário do setor!",
        variant: "destructive",
      });
    }
  };

  const getUsersOnSector = async (sectorId: string) => {
    try {
      const response = await getUsersOnSectorById(sectorId);
      setUsersOnSector(response);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsersOnSector([]);
    }
  };

  const fetchData = async () => {
    const fetchedSectors = await getSectors();
    setSectors(fetchedSectors);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col text-center gap-2">
        <h1 className="text-lg sm:text-2xl font-bold">
          Lista de Setores Cadastrados
        </h1>
        <span className="text-xs sm:text-sm text-muted-foreground">
          Gerencie os setores da sua organização.
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <CreateNewSector onCreateSuccess={fetchData} />
          <Input type="text" placeholder="Pesquisar..." />
        </div>

        <Table>
          <ScrollArea className="sm:h-[23vh] md:h-[23vh] lg:h-[72vh] w-full">
            <TableHeader>
              <TableRow>
                <TableHead className={styles.head}>Setor</TableHead>
                <TableHead className={styles.head}>Usuários</TableHead>
                <TableHead className={styles.head}>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-auto">
              {sectors.length > 0 ? (
                sectors.map((sector) => (
                  <TableRow key={sector.id}>
                    <TableCell className={styles.head}>
                      <span>{sector.name}</span>
                    </TableCell>
                    <TableCell className={styles.head}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => fetchUsersHave(sector.id)}
                            variant={"ghost"}
                          >
                            <BadgeMinus className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              Exclua um usuário por vez do setor:
                            </DialogTitle>
                            <DialogDescription>{sector.name}</DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col text-center gap-0.5">
                            {usersHave.length > 0 ? (
                              usersHave.map((user, index) => (
                                <DialogClose key={index}>
                                  <Button
                                    variant={"outline"}
                                    className="text-sm text-muted-foreground"
                                    onClick={() =>
                                      excludeUserToSector(user.id, sector.id)
                                    }
                                  >
                                    {user.name}
                                  </Button>
                                </DialogClose>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground text-center">
                                Nenhum usuário cadastrado no setor.
                              </span>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            onClick={() => getUsersOnSector(sector.id)}
                            variant={"ghost"}
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <ScrollArea>
                            <div>
                              <h4 className="mb-4 text-center text-sm text-muted-foreground">
                                Usuários presentes no setor: <br />
                                {sector.name}
                              </h4>
                              <DropdownMenuSeparator />
                              <div className="flex flex-col text-center gap-0.5">
                                {usersOnSector.length > 0 ? (
                                  usersOnSector.map((name, index) => (
                                    <span
                                      className="text-sm text-muted-foreground"
                                      key={index}
                                    >
                                      {name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground text-center">
                                    Nenhum usuário encontrado.
                                  </span>
                                )}
                              </div>
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => fetchUsersNonHave(sector.id)}
                            variant={"ghost"}
                          >
                            <BadgePlus className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              Adicione um usuário por vez ao setor:
                            </DialogTitle>
                            <DialogDescription>{sector.name}</DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col text-center gap-0.5">
                            {users.length > 0 ? (
                              users.map((user, index) => (
                                <DialogClose key={index}>
                                  <Button
                                    variant={"outline"}
                                    className="text-sm text-muted-foreground"
                                    onClick={() =>
                                      includeUserToSector(user.id, sector.id)
                                    }
                                  >
                                    {user.name}
                                  </Button>
                                </DialogClose>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground text-center">
                                Todos os usuários estão cadastrados no setor.
                              </span>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className={styles.head}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                          <DeleteButton id={sector.id} onSuccess={fetchData} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Nenhum setor encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
    </div>
  );
};
