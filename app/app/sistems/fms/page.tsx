"use client";

import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from "@/components/dashboard/page";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/app/app/_components/loading-screen";
import { GetUser } from "./_actions/fms-actions";
import Main from "./_components/main";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string>("");

  const fetchRole = async () => {
    try {
      setIsLoading(true);
      const response = await GetUser();
      const role = response?.role as string;
      setRole(role);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <DashboardPage>
          <DashboardPageHeader>
            <DashboardPageHeaderTitle>
              Gerenciador de Arquivos
            </DashboardPageHeaderTitle>
          </DashboardPageHeader>
          <DashboardPageMain>
            <Main role={role} />
          </DashboardPageMain>
        </DashboardPage>
      )}
    </div>
  );
}
