import type { Meeting, UserToMeeting } from "@/app/types/types";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getMeetingById,
  getUsersOnMeeting,
} from "../../../_actions/meetings-actions";
import { useEffect, useState } from "react";
import { DeleteUser } from "./delete-user";
import { SelectUsersAgain } from "./select-users-again";

interface ReportListProps {
  meetingId: string;
}

export const ReportList = ({ meetingId }: ReportListProps) => {
  const [meeting, setMeeting] = useState<Meeting>();
  const [usersOnMeeting, setUsersOnMeeting] = useState<UserToMeeting[]>([]);

  const getMeeting = async () => {
    const meeting = await getMeetingById(meetingId);
    if (meeting) {
      setMeeting(meeting);
    }
  };

  const handleUpdate = (id: string) => {
    setUsersOnMeeting((prevUsers) =>
      prevUsers.filter((users) => users.id !== id)
    );
  };

  const getListUsersOnMeeting = async (id: string) => {
    const users = await getUsersOnMeeting(id);
    if (users) {
      setUsersOnMeeting(users);
    }
  };

  useEffect(() => {
    getMeeting();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => getListUsersOnMeeting(meetingId)}
          variant={"link"}
          className="w-full"
        >
          {meeting?.name} - {meeting?.date}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tudo sobre a reunião:{" "}
            <span className="text-muted-foreground font-bold">
              {meeting?.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Aqui você consegue ver todas as informações da reunião, bem como o
            relatório gerado pelo sistema.
          </DialogDescription>
        </DialogHeader>
        <form action="" className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="pl-2">Data da reunião</Label>
              <Input type="text" defaultValue={meeting?.date} />
            </div>
            <div>
              <Label className="pl-2">Nome da reunião</Label>
              <Input type="text" defaultValue={meeting?.name} />
            </div>
          </div>
          <SelectUsersAgain
            meetingId={meetingId}
            onUpdate={getListUsersOnMeeting}
          />
          <ScrollArea>
            <div className="p-2 gap-2 flex flex-col">
              {usersOnMeeting.map((user, index) => (
                <div key={index} className="flex gap-2">
                  <Button variant={"link"} type={"button"} className="w-full">
                    {user.name}
                  </Button>
                  <DeleteUser id={user.id} onDelete={handleUpdate} />
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant={"default"} className="w-full">
              Salvar alteranças
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
