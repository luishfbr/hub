"use client";

import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from "@/components/dashboard/page";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
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
              <div>
                Criado por{" "}
                <a
                  href="https://www.linkedin.com/in/luishenriquedev/"
                  target="_blank"
                  className="text-primary underline hover:text-primary/80"
                >
                  Luis Henrique Fonte Boa Romualdo
                </a>
              </div>
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
                possíveis, como por exemplo gerenciador de arquivos, gerador de placa pix, otimizador de pdf etc.
              </span>
            </div>
          </CardContent>
        </Card>
      </DashboardPageMain>
    </DashboardPage>
  );
}
