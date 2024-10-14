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
import { useState } from "react";
import { MainSidebarProps } from "@/app/types/types";
import {
  ArrowLeftToLine,
  ArrowRightFromLine,
  Wrench,
  HomeIcon,
  File,
  Presentation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MainSidebar({ role, sectors, user }: MainSidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [expanded, setExpanded] = useState(true);

  if (!role || !sectors) {
    return null;
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
    role === "ADMIN" ||
    sectors.some((sector) =>
      allowedSectorsFMS.includes(normalizeString(sector.name))
    );

  return (
    <DashboardSidebar>
      <DashboardSidebarHeader>
        {expanded ? <Logo /> : null}
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setExpanded((curr) => !curr)}
        >
          {expanded ? <ArrowLeftToLine /> : <ArrowRightFromLine />}
        </Button>
      </DashboardSidebarHeader>
      <DashboardSidebarMain className="flex flex-col flex-grow">
        <DashboardSidebarNav>
          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink
              href="/app/sistems"
              active={isActive("/app/sistems")}
            >
              {expanded ? (
                "Página Inicial"
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HomeIcon className="w-5 h-5" />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Página Inicial</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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
                {expanded ? (
                  "Tabela de Arquivos"
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <File className="w-5 h-5" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>Tabela de Arquivos</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
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
              {expanded ? (
                "Reuniões"
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Presentation className="w-5 h-5" />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Reuniões</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </DashboardSidebarNavLink>
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>
        {role === "ADMIN" && (
          <DashboardSidebarNav className="mt-auto">
            <DashboardSidebarNavHeader>
              <DashboardSidebarNavHeaderTitle>
                {expanded ? "Somente Administrador" : null}
              </DashboardSidebarNavHeaderTitle>
            </DashboardSidebarNavHeader>
            <DashboardSidebarNavMain>
              <DashboardSidebarNavLink
                href="/app/sistems/admin"
                active={isActive("/app/sistems/admin")}
              >
                {expanded ? (
                  "Painel de Administração"
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Wrench className="w-5 h-5" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>Painel de Administração</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </DashboardSidebarNavLink>
            </DashboardSidebarNavMain>
          </DashboardSidebarNav>
        )}
      </DashboardSidebarMain>
      <DashboardSidebarFooter>
        <UserDropdown user={user} isExpanded={expanded} />
      </DashboardSidebarFooter>
    </DashboardSidebar>
  );
}
