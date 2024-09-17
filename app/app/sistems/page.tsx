"use client";

import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderNav,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from "@/components/dashboard/page";

export default async function Page() {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          Hub de Sistemas do Sicoob Uberaba
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bem-vindo ao Hub de Sistemas do Sicoob Uberaba
          </h2>
          <p className="text-lg mb-6">
            Aqui você encontrará acesso centralizado a todos os sistemas e
            ferramentas essenciais para o seu trabalho na Sicoob Uberaba.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Gerenciador de Arquivos
              </h3>
              <p className="mb-4">
                Acesse e gerencie todos os documentos e arquivos importantes da
                cooperativa.
              </p>
              <a
                href="/app/sistems/fms"
                className="text-blue-600 hover:underline"
              >
                Acessar →
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Outros Sistemas</h3>
              <p className="mb-4">
                Em breve, mais sistemas serão integrados para facilitar seu
                trabalho diário.
              </p>
            </div>
          </div>
        </div>
      </DashboardPageMain>
    </DashboardPage>
  );
}
