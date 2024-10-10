"use client"

import { MeetingMod, UserToMeeting } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Pencil } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getMeetingById, updateMeeting, updateUsersOnMeeting } from "../../_actions/meetings-actions";
import { Calendar } from "@/components/ui/calendar";
import { CheckboxUsers } from "../forms/_components/checkbox-users";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";

interface EditMeetingsProps {
    id: string;
    onUpdate: () => void;
}

export function EditMeetings({ id, onUpdate }: EditMeetingsProps) {
    const { toast } = useToast();
    const [meeting, setMeeting] = useState<MeetingMod | null>(null);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [name, setName] = useState<string>("");
    const [selectedUsers, setSelectedUsers] = useState<UserToMeeting[]>([]);

    useEffect(() => {
        const fetchMeeting = async () => {
            const res = await getMeetingById(id);
            if (res) {
                setMeeting(res);
                setName(res.name);
            }
        };
        fetchMeeting();
    }, [id]);

    const handleSelectUser = useCallback((data: UserToMeeting[]) => {
        setSelectedUsers(data);
    }, []);

    const dateFormat = date?.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast({
                title: "Nome inválido",
                description: "O nome da reunião é obrigatório",
                variant: "destructive",
            });
            return;
        }

        if (selectedUsers.length > 0) {
            await updateUsersOnMeeting(meeting?.id || "", selectedUsers);
        }

        const data = {
            name: name,
            date: dateFormat || "",
            id: meeting?.id || "",
        };

        const res = await updateMeeting(data);
        if (res) {
            toast({
                title: "Mudanças salvas com sucesso",
                description: "As mudanças foram salvas com sucesso",
                variant: "success",
            });
            onUpdate();
        } else {
            toast({
                title: "Ocorreu um erro",
                description: "Não foi possível salvar as mudanças",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size={"icon"}>
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edição de reunião</DialogTitle>
                    <DialogDescription>
                        Faça as mudanças necessárias, inclusive a seleção de novos usuários.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdate}>
                    <div className="flex flex-col items-center justify-center gap-6 my-6">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border shadow"
                            disabled={(date) =>
                                date.getTime() < new Date().setHours(0, 0, 0, 0)
                            }
                        />
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="flex items-center text-center justify-center gap-2">
                                <Label>Data anterior:</Label>
                                <span className="text-red-500">{meeting?.date}</span>
                            </div>
                            <div className="flex items-center text-center justify-center gap-2">
                                <Label>Dia selecionado:</Label>
                                <span className="text-muted-foreground">{dateFormat}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4 w-full">
                            <Label>Nome anterior:</Label>
                            <span className="text-red-500">{meeting?.name}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-4 w-full">
                            <Label>Nome da Reunião:</Label>
                            <Input
                                type="text"
                                placeholder="Nome da Reunião"
                                className="w-full"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        {name.length > 0 ? (
                            <CheckboxUsers
                                meetingName={name}
                                onSelectUser={handleSelectUser}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 w-full">
                                <span className="text-sm text-muted-foreground text-center">
                                    Escreva o nome da reunião para que apareça os usuários.
                                </span>
                            </div>
                        )}
                        {selectedUsers.length > 0 && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Button variant="ghost" className="flex gap-4">
                                        Lista de usuários selecionados <Eye />
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-auto">
                                    {selectedUsers.map((user, index) => (
                                        <div key={index}>
                                            <span className="text-muted-foreground">
                                                {user.name}
                                            </span>
                                        </div>
                                    ))}
                                </HoverCardContent>
                            </HoverCard>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit">Salvar mudanças</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
