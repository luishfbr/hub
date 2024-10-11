"use client";

import { useEffect, useState } from "react";
import { getName } from "../_actions/initial";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export function InitialPage() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const userName = await getName();
      setName(userName as string);
    };
    fetchUserName();
  }, []);

  return (
    <ScrollArea className="h-[88vh] w-full">
      <div className="flex flex-col gap-6 w-full text-justify">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-primary">
            Seja bem-vindo(a), {name}
          </h1>
          <span className="text-muted-foreground">
            Bem-vindo(a) ao Hub de Sistemas do Sicoob Uberaba, um aglomerado de
            sistemas em um só lugar. Veja os exemplos e dicas abaixo.
          </span>
        </div>
        <Card>
          <div className="flex flex-col gap-2 m-6">
            <p className="text-xl">Gerenciador de Arquivos</p>
            <span className="text-muted-foreground">
              Controle totalmente seus arquivos, através de uma interface
              simples e intuitiva. Suas principais características são:
            </span>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Navegação rápida e intuitiva.</li>
              <li>
                Controle de vizualização e criação de arquivos por meio de
                acessos e setores.
              </li>
              <li>
                Vizualize de forma organizada seus arquivos com base nos modelos
                criados, para os setores que você pertence.
              </li>
              <li>
                Com a permissão de criador ou administrador, você possui acesso
                à criação de modelos novos com base nas suas necessidades, isso
                significa que você criar novos modelos incluindo qualquer tipo
                de valor, seja campo de texto, número, menu de seleção e data.
              </li>
              <li>
                Caso tenha algum modelo que não esteja da forma que você
                gostaria, na aba edição de modelos, você possui controle total
                sobre o modelo já criado, incluindo remoção do mesmo, exclusão
                ou modificação dos campos já existentes e adição de novos
                campos.
              </li>
              <li>
                Na aba de importar modelos, você consegue importar modelos
                extraídos de outras plataformas desde que estejam em formato
                .xlsx que é o formato do Excel, formate a tabela antes
                substituindo os valores em branco por (vazio), lembrando que o
                programa puxará somente a primeira tabela da planilha, fique
                atento.
              </li>
            </ul>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-2 m-6">
            <p className="text-xl">Gerenciador de Reuniões</p>
            <span className="text-muted-foreground">
              Controle totalmente as reuniões da sua organização, somente se
              pertencer ao setor da Secretaria Executiva ou possuir a permissão
              de administrador. Suas principais características são:
            </span>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>
                Vizualize de forma organizada as reuniões que você pertence.
              </li>
              <li>
                Preste bastante atenção na tabela de reuniões, em cada reunião
                existe o campo de adição de arquivos, caso você vá apresentar
                algo, os arquivos são enviados para o(a) criador(a) da reunião.
              </li>
              <li>
                Caso tenha algum modelo que não esteja da forma que você
                gostaria, na aba edição de modelos, você possui controle total
                sobre o modelo já criado, incluindo remoção do mesmo, exclusão
                ou modificação dos campos já existentes e adição de novos
                campos.
              </li>
              <li>
                Para administradores e representantes da Secretaria Executiva,
                você possui acesso a todas as reuniões, incluindo a criação de
                novas reuniões, por meio dos botões localizados na parte
                superior direita.
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}
