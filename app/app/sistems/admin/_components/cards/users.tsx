"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@/app/types/types";
import { getUsers } from "./_actions/users";
import { DeleteButton } from "./_components/userButtons/deleteButton";
import { ChangeRole } from "./_components/userButtons/changeRole";
import { EditButton } from "./_components/userButtons/editButton";
import { CreateNewUser } from "./createNewUser";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import styles from "@/app/styles/main.module.css";

export function CardUsers() {
  const [user, setUser] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchData = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUser(fetchedUsers);
    } catch (error) {
      console.error("Falha ao buscar usuários.", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = user.filter((user) =>
    [user.name, user.email, user.role].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col text-center gap-2">
        <h1 className="text-lg sm:text-2xl font-bold">Lista de Usuários</h1>
        <span className="text-xs sm:text-sm text-muted-foreground">
          Pesquise pelo nome, email ou permissão do colaborador.
        </span>
      </div>

      <div className="flex flex-col gap-6">
        <Input
          type="text"
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ScrollArea className="md:h-[25vh] lg:h-[68vh] overflow-x-auto rounded-md border shadow-md">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className={styles.head}>Nome</TableHead>
                  <TableHead className={styles.head}>Email</TableHead>
                  <TableHead className={styles.head}>Permissão</TableHead>
                  <TableHead className={styles.head}></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.email}>
                      <TableCell className={styles.head}>{user.name}</TableCell>
                      <TableCell className={styles.head}>
                        {user.email}
                      </TableCell>
                      <TableCell className={styles.head}>{user.role}</TableCell>
                      <TableCell className={styles.head}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className="flex">
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir Menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center">
                            <DeleteButton
                              email={user.email}
                              onDeleteSuccess={fetchData}
                            />
                            <DropdownMenuSeparator />
                            <ChangeRole
                              email={user.email}
                              onChangeSuccess={fetchData}
                            />
                            <DropdownMenuSeparator />
                            <EditButton email={user.email} />
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
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
      <CreateNewUser onCreateSuccess={fetchData} />
    </div>
  );
}
