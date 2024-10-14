"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import styles from "@/app/styles/main.module.css";
import { redirect } from "next/navigation";
import { MainSidebar } from "./_components/main-sidebar";
import type { User } from "next-auth";
import { LoadingScreen } from "./_components/loading-screen";
import {
  GetRoleAndSectorsByUserId,
  GetUserSession,
} from "./_actions/app-actions";
import type { Sector } from "../types/types";

export default function Layout({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string>("");
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [user, setUser] = useState<User>();

  const UserSession = async () => {
    try {
      setIsLoading(true);
      const session = await GetUserSession();
      if (!session?.user) {
        redirect("/");
      } else {
        setUser(session?.user);
        const res = await GetRoleAndSectorsByUserId(
          session?.user?.id as string
        );
        if (res) {
          setRole(res.role);
          setSectors(res.sectors);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    UserSession();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.layout}>
      <MainSidebar role={role as string} sectors={sectors} user={user} />
      <main>{children}</main>
    </div>
  );
}
