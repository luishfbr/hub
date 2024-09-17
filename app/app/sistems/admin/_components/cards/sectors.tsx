"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { DeleteButton } from "./_components/sectorsButtons/deleteButton";
import styles from "@/app/app/styles/main.module.css";
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "../../../../utils/ToastContext";

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
    const { showToast } = useToast();
    const [sectors, setSectors] = React.useState<Sector[]>([]);
    const [usersOnSector, setUsersOnSector] = React.useState<string[]>([]);
    const [users, setUsers] = React.useState<ReturnedUser[]>([]);
    const [usersHave, setUsersHave] = React.useState<ReturnedUser[]>([]);

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
            showToast("Usuário incluído com sucesso!");
        } catch (error) {
            console.error("Falha ao incluir usuário ao setor:", error);
            showToast("Falha ao incluir usuário ao setor!");
        }
    };

    const excludeUserToSector = async (userId: string, sectorId: string) => {
        try {
            await excludeUserToSectorById(userId, sectorId);
            fetchData();
            showToast("Usuário excluído com sucesso!");
        } catch (error) {
            console.error("Falha ao excluir usuário do setor:", error);
            showToast("Usuário excluído com sucesso!");
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

    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Setores Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea
                        className={`${styles.scrollArea} h-[705px] rounded-md border`}
                    >
                        <div className="overflow-x-auto">
                            <table
                                className={`${styles.table} min-w-full divide-y divide-gray-200`}
                            >
                                <thead className={styles.tableHeader}>
                                    <tr>
                                        <th className={styles.th}>Setor</th>
                                        <th className={styles.th}>Usuários</th>
                                        <th className={styles.th}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody className={styles.tableBody}>
                                    {sectors.length > 0 ? (
                                        sectors.map((sector) => (
                                            <tr key={sector.id}>
                                                <td className={styles.td}>
                                                    <span>{sector.name}</span>
                                                </td>
                                                <td className={styles.td}>
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
                                                                <DialogDescription>
                                                                    {sector.name}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="flex flex-col text-center gap-0.5">
                                                                {usersHave.length > 0 ? (
                                                                    usersHave.map((user, index) => (
                                                                        <DialogClose key={index}>
                                                                            <Button
                                                                                variant={"outline"}
                                                                                className="text-sm text-muted-foreground"
                                                                                onClick={() =>
                                                                                    excludeUserToSector(
                                                                                        user.id,
                                                                                        sector.id
                                                                                    )
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
                                                            <DialogFooter></DialogFooter>
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
                                                                <DialogDescription>
                                                                    {sector.name}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="flex flex-col text-center gap-0.5">
                                                                {users.length > 0 ? (
                                                                    users.map((user, index) => (
                                                                        <DialogClose key={index}>
                                                                            <Button
                                                                                variant={"outline"}
                                                                                className="text-sm text-muted-foreground"
                                                                                onClick={() =>
                                                                                    includeUserToSector(
                                                                                        user.id,
                                                                                        sector.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                {user.name}
                                                                            </Button>
                                                                        </DialogClose>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-sm text-muted-foreground text-center">
                                                                        Todos os usuários estão cadastrados no
                                                                        setor.
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <DialogFooter></DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </td>
                                                <td className={styles.td}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Abrir Menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="center">
                                                            <DeleteButton
                                                                id={sector.id}
                                                                onSuccess={fetchData}
                                                            />
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
                                                Nenhum setor encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex text-center justify-center">
                    <CreateNewSector onCreateSuccess={fetchData} />
                </CardFooter>
            </Card>
        </div>
    );
};