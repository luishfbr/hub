"use client"

import { Pointer } from 'lucide-react'
import { MeetingToAction, UserToMeeting } from "@/app/types/types"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCallback, useEffect, useState } from "react"
import { MeetingsByCreatedBy, User } from "../../_actions/meetings-actions"
import { EditMeetings } from "./edit-meetings"
import { DeleteButtonMeetings } from "./delete-meetings"

export function ActionsAdmin() {
    const [meetings, setMeetings] = useState<MeetingToAction[]>([])
    const [user, setUser] = useState<UserToMeeting>()

    const handleUpdate = () => {
        fetchingMeetings()
    }

    const fetchingUserId = async () => {
        const res = await User()
        if (res) {
            setUser(res)
        }
    }

    const fetchingMeetings = useCallback(async () => {
        const res = await MeetingsByCreatedBy(user?.id as string);

        if (res) {
            setMeetings(res)
        }
    }, [user?.id])

    useEffect(() => {
        fetchingUserId()
        fetchingMeetings()
    }, [fetchingMeetings])
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="link" className='flex gap-2 items-center'>
                    <Pointer className='w-4 h-4' />
                    Minhas reuniões
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edição ou exclusão de reuniões</SheetTitle>
                    <SheetDescription>
                        Tome bastante cuidado ao editar ou excluir as reuniões, avise ao pessoal as mudanças que estão sendo feitas. Abaixo aparece apenas as reuniões que você criou.
                    </SheetDescription>
                </SheetHeader>
                <Table className="my-6">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Editar</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Excluir</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meetings.map((meeting, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <EditMeetings id={meeting.id} onUpdate={handleUpdate} />
                                </TableCell>
                                <TableCell>{meeting.name}</TableCell>
                                <TableCell>
                                    <DeleteButtonMeetings id={meeting.id} onDelete={handleUpdate} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </SheetContent>
        </Sheet>
    )
}
