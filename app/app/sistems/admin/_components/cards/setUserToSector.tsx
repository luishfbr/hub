"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "@/app/app/styles/main.module.css";
import { getUsers } from "./_actions/users";
import { DeleteButton } from "./_components/usersButtons/deleteButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { EditButton } from "./_components/usersButtons/editButton";
import { ChangeRole } from "./_components/usersButtons/changeRole";
import { CreateNewUser } from "./createNewUser";

export type User = {
  name: string;
  email: string;
  role: string;
};

export function CardUsers() {
  const [user, setUser] = React.useState<User[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const fetchData = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUser(fetchedUsers);
    } catch (error) {
      console.error("Falha ao buscar usuários.", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = user.filter((user) =>
    [user.name, user.email, user.role].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Card className={`${styles.card} w-full h-full`}>
      <CardHeader>
        <CardTitle>Lista de Usuários Cadastrados</CardTitle>
        <CardDescription>
          Pesquise pelo nome, email ou permissão do colaborador.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <ScrollArea className={`${styles.scrollArea} h-[60vh] max-h-[100vh] rounded-md border`}>
          <div className="overflow-x-auto">
            <table className={`${styles.table} min-w-full divide-y divide-gray-200`}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.th}>Nome</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Permissão</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.email} className={styles.tableRow}>
                      <td className={styles.td}>{user.name}</td>
                      <td className={styles.td}>{user.email}</td>
                      <td className={styles.td}>{user.role}</td>
                      <td className={styles.td}>
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
                            <ChangeRole email={user.email} onChangeSuccess={fetchData} />
                            <DropdownMenuSeparator />
                            <EditButton email={user.email} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex text-center justify-center">
        <CreateNewUser onCreateSuccess={fetchData} />
      </CardFooter>
    </Card>
  );
}