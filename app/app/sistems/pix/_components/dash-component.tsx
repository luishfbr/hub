import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from "@/components/dashboard/page";
import { Main } from "./main";

export default function DashComponent() {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          Gerador de Placa Pix
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <Main />
      </DashboardPageMain>
    </DashboardPage>
  );
}
