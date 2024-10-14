"use client";

import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import styles from "@/app/styles/main.module.css";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const UserSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await GetUserSession();

      if (session?.user) {
        setUser(session?.user);
        const id = session?.user?.id as string;
        const res = await GetRoleAndSectorsByUserId(id);
        if (res) {
          setRole(res.role);
          setSectors(res.sectors);
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    UserSession();
  }, [UserSession]);

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
