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
import { useEffect, useState } from "react";
import { GetRoleById, GetSectorsByUserId } from "../_actions/app-actions";
import { MainSidebarProps, Sector, UserRole } from "@/app/types/types";

export function MainSidebar({ user }: MainSidebarProps) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userSectors, setUserSectors] = useState<Sector[] | null>(null);
  const id = user?.id as string;
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  async function getUserRole() {
    const role = await GetRoleById(id);
    setUserRole(role);
  }

  async function getUserSectors() {
    const sectors = await GetSectorsByUserId(id);
    if (sectors) {
      setUserSectors(sectors.sectors);
    }
  }

  useEffect(() => {
    getUserRole();
    getUserSectors();
  }, [getUserRole, getUserSectors]);

  if (!userRole || !userSectors) {
    return <div>Carregando informações do usuário...</div>;
  }

  const allowedSectorsFMS = [
    "tecnologiadainformacao",
    "credito",
    "recursoshumanos",
    "departamentopessoal",
    "cedoc",
    "cadastro",
  ];

  const allowedSectorsPIX = ["tecnologiadainformacao", "linhadefrente"];

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

  // const hasAccessToPIX =
  //   userRole.role === "ADMIN" ||
  //   userSectors.some((sector) =>
  //     allowedSectorsPIX.includes(normalizeString(sector.name))
  //   );

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
        {/* {hasAccessToPIX && (
          <DashboardSidebarNav>
            <DashboardSidebarNavMain>
              <DashboardSidebarNavLink
                href="/app/sistems/pix"
                active={isActive("/app/sistems/pix")}
              >
                Gerador de Placa Pix
              </DashboardSidebarNavLink>
            </DashboardSidebarNavMain>
          </DashboardSidebarNav>
        )} */}
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
