"use client";

import {
  DashboardSidebar,
  DashboardSidebarHeader,
  DashboardSidebarMain,
  DashboardSidebarNav,
  DashboardSidebarNavMain,
  DashboardSidebarNavLink,
  DashboardSidebarFooter,
  DashboardSidebarNavHeader,
  DashboardSidebarNavHeaderTitle,
} from "@/components/dashboard/sidebar";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Session } from "next-auth";
import { UserDropdown } from "./user-dropdown";
import { useEffect, useState } from "react";
import { GetRoleById } from "../_actions/app-actions";

type MainSidebarProps = {
  user: Session["user"];
};

interface UserRole {
  role: string;
}

export function MainSidebar({ user }: MainSidebarProps) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const id = user?.id as string;
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  async function getUserRole() {
    const role = await GetRoleById(id);
    setUserRole(role);
  }

  useEffect(() => {
    getUserRole();
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
        </DashboardSidebarNav>

        {userRole?.role === "ADMIN" && (
          <DashboardSidebarNav className="mt-auto">
            <DashboardSidebarNavHeader>
              <DashboardSidebarNavHeaderTitle>
                Somente Administrador
              </DashboardSidebarNavHeaderTitle>
            </DashboardSidebarNavHeader>
            <DashboardSidebarNavMain>
              <DashboardSidebarNavLink
                href="/app/sistems/admin"
                active={isActive("/app/sistems/admin")}
              >
                Painel de Administração
              </DashboardSidebarNavLink>
            </DashboardSidebarNavMain>
          </DashboardSidebarNav>
        )}
      </DashboardSidebarMain>
      <DashboardSidebarFooter>
        <UserDropdown user={user} />
      </DashboardSidebarFooter>
    </DashboardSidebar>
  );
}
