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
import { UserDropdown } from "./user-dropdown";
import { useCallback, useEffect, useState } from "react";
import { GetRoleById, GetSectorsByUserId } from "../_actions/app-actions";
import { MainSidebarProps, Sector, UserRole } from "@/app/types/types";
import { Loader2 } from "lucide-react";

export function MainSidebar({ user }: MainSidebarProps) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userSectors, setUserSectors] = useState<Sector[] | null>(null);
  const id = user?.id as string;
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const getUserRole = useCallback(async () => {
    const role = await GetRoleById(id);
    setUserRole(role);
  }, [id])

  const getUserSectors = useCallback(async () => {
    const sectors = await GetSectorsByUserId(id);
    if (sectors) {
      setUserSectors(sectors.sectors);
    }
  }, [id])

  useEffect(() => {
    getUserRole();
    getUserSectors();
  }, [id, getUserRole, getUserSectors]);

  if (!userRole || !userSectors) {
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    )
  }

  const allowedSectorsFMS = [
    "tecnologiadainformacao",
    "credito",
    "recursoshumanos",
    "departamentopessoal",
    "cedoc",
    "cadastro",
  ];

  const normalizeString = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

  const hasAccessToFMS =
    userRole.role === "ADMIN" ||
    userSectors.some((sector) =>
      allowedSectorsFMS.includes(normalizeString(sector.name))
    );

  return (
    <DashboardSidebar>
      <DashboardSidebarHeader>
        <Logo />
      </DashboardSidebarHeader>
      <DashboardSidebarMain className="flex flex-col flex-grow">
        <DashboardSidebarNav>
          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink
              href="/app/sistems"
              active={isActive("/app/sistems")}
            >
              Página Inicial
            </DashboardSidebarNavLink>
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>
        {hasAccessToFMS && (
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
        )}
        <DashboardSidebarNav>
          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink
              href="/app/sistems/meetings"
              active={isActive("/app/sistems/meetings")}
            >
              Reuniões
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
