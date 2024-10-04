"use client";

import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderNav,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from "@/components/dashboard/page";
import { Main } from "./main";
import { useEffect, useState } from "react";
import type { AllInfoUser } from "@/app/types/types";
import { GetCompleteUser } from "../_actions/meetings-actions";
import { Loader2 } from "lucide-react";
import { CreateNewMeetingForm } from "./forms/create-new-meeting";

export function DashComponent() {
  const [user, setUser] = useState<AllInfoUser | null>(null);
  const [updateMeetings, setUpdateMeetings] = useState<boolean>(false);

  const User = async () => {
    const res = await GetCompleteUser();
    setUser(res);
  };

  const handleUpdateMeetings = () => {
    setUpdateMeetings(true);
    setTimeout(() => {
      setUpdateMeetings(false);
    }, 1000);
    console.log("update meetings", updateMeetings);
  };

  const allowedSectorsMeetings = ["tecnologiadainformacao", "secretaria"];

  const normalizeString = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

  const hasAccessToMeetings =
    user?.role === "ADMIN" ||
    user?.sectors?.some((sector) =>
      allowedSectorsMeetings.includes(normalizeString(sector.name))
    );

  useEffect(() => {
    User();
  }, []);
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          Bem-vindo ao controle de reuniões
        </DashboardPageHeaderTitle>
        {hasAccessToMeetings && (
          <DashboardPageHeaderNav>
            <CreateNewMeetingForm
              id={user?.id as string}
              onUpdate={handleUpdateMeetings}
            />
          </DashboardPageHeaderNav>
        )}
      </DashboardPageHeader>
      <DashboardPageMain>
        {!user ? (
          <div className="flex items-center justify-center w-full h-[70vh]">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : (
          <Main id={user?.id as string} updateMeetings={updateMeetings} />
        )}
      </DashboardPageMain>
    </DashboardPage>
  );
}
