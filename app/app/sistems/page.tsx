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
import { InitialPage } from "./_components/initial";

export default function Page() {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          Hub de Sistemas do Sicoob Uberaba
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <InitialPage />
      </DashboardPageMain>
    </DashboardPage>
  );
}
