"use client";

import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderNav,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from "@/components/dashboard/page";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/app/app/_components/loading-screen";
import { GetUser } from "./_actions/fms-actions";
import Main from "./_components/main";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Archive, File, List, Table } from "lucide-react";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string | null>("tables");

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
            {role === "CREATOR" || role === "ADMIN" ? (
              <DashboardPageHeaderNav className="flex gap-2 items-center">
                <Button
                  variant={"outline"}
                  className="hidden md:flex"
                  onClick={() => setSelectedTab("tables")}
                >
                  Tabelas
                </Button>
                <Button
                  variant={"outline"}
                  className="hidden md:flex"
                  onClick={() => setSelectedTab("models")}
                >
                  Modelos
                </Button>
                <Button
                  variant={"outline"}
                  className="hidden md:flex"
                  onClick={() => setSelectedTab("import")}
                >
                  Arquivos
                </Button>
                <div className="md:hidden">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"ghost"} size={"icon"}>
                        <List />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-2 w-auto">
                      <Button
                        variant={"default"}
                        className="w-auto gap-2 flex justify-between"
                        onClick={() => setSelectedTab("tables")}
                      >
                        <Table />
                        Tabelas
                      </Button>
                      <Button
                        variant={"default"}
                        className="w-auto gap-2"
                        onClick={() => setSelectedTab("models")}
                      >
                        <Archive />
                        Modelos
                      </Button>
                      <Button
                        variant={"default"}
                        className="w-auto gap-2"
                        onClick={() => setSelectedTab("import")}
                      >
                        <File />
                        Arquivos
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </DashboardPageHeaderNav>
            ) : null}
          </DashboardPageHeader>
          <DashboardPageMain>
            <Main tab={selectedTab as string} />
          </DashboardPageMain>
        </DashboardPage>
      )}
    </div>
  );
}
