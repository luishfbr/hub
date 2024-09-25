"use client";

// import { Logout } from "@/app/(auth)/_actions/auth";
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from "@/components/dashboard/page";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  // CardFooter,
} from "@/components/ui/card";

export default function Page() {
  // const handleLogout = async () => {
  //   await Logout();
  // };
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          Hub de Sistemas do Sicoob Uberaba
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <Card>
          <CardHeader>
            <CardTitle>
              Seja bem-vindo ao Hub de Sistemas do Sicoob Uberaba
            </CardTitle>
            <CardDescription className="flex flex-col gap-2">
              <span>Precisa de ajuda? Me chame no Teams. </span>
              <span>3178 - Luis Henrique Fonte Boa Romualdo</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <p>
                Este é um sistema de apoio ao gerenciamento de sistemas da
                Cooperativa.
              </p>
              <span className="text-sm text-muted-foreground">
                A idéia é criar um sistema que possa ser utilizado por todos os
                setores da Cooperativa. Centralizando o máximo de sistemas
                possíveis, como por exemplo gerenciador de arquivos, gerador de
                placa pix, otimizador de pdf etc.
              </span>
            </div>
          </CardContent>
          {/* <CardFooter>
            <Button onClick={handleLogout} variant={"link"}>
              Sair...
            </Button>
          </CardFooter> */}
        </Card>
      </DashboardPageMain>
    </DashboardPage>
  );
}
