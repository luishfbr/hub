import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderNav,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from "@/components/dashboard/page";
import Main from "./main";

export default function DashComponent() {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          Gerenciador de Arquivos
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <Main />
      </DashboardPageMain>
    </DashboardPage>
  );
}
