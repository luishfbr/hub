"use client";

import {
  DashboardSidebar,
  DashboardSidebarHeader,
  DashboardSidebarMain,
  DashboardSidebarNav,
  DashboardSidebarNavMain,
  DashboardSidebarNavLink,
  DashboardSidebarFooter,
} from "@/components/dashboard/sidebar";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Session } from "next-auth";
import { UserDropdown } from "./user-dropdown";
import { useEffect, useState } from "react";
import { GetUser } from "../_actions/app-actions";

type MainSidebarProps = {
  user: Session["user"];
};

interface UserRole {
  role: string;
}

export function MainSidebar({ user }: MainSidebarProps) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = await GetUser();
      setUserRole(userRole);
    };

    fetchUserRole();
  }, []);
  return (
    <DashboardSidebar>
      <DashboardSidebarHeader>
        <Logo />
      </DashboardSidebarHeader>
      <DashboardSidebarMain className="flex flex-col flex-grow">
        <DashboardSidebarNav>
          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink
              href="/app/sistems/fms"
              active={isActive("/app/sistems/fms")}
            >
              Tabela de Arquivos
            </DashboardSidebarNavLink>
          </DashboardSidebarNavMain>
          {userRole?.role === "ADMIN" && (
            <DashboardSidebarNavMain>
              <DashboardSidebarNavLink
                href="/app/sistems/admin"
                active={isActive("/app/sistems/admin")}
              >
                Configurações de Administrador
              </DashboardSidebarNavLink>
            </DashboardSidebarNavMain>
          )}
        </DashboardSidebarNav>
      </DashboardSidebarMain>
      <DashboardSidebarFooter>
        <UserDropdown user={user} />
      </DashboardSidebarFooter>
    </DashboardSidebar>
  );
}
