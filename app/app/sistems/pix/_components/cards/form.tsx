"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const InputGroup = [
  {
    label: "Nome do Beneficiado",
    placeholder: "Nome do Beneficiado",
    type: "text",
    key: "nome",
  },
  {
    label: "Chave PIX",
    placeholder: "Digite a chave PIX",
    type: "text",
    key: "chave",
  },
  {
    label: "Quantidade de Placas",
    placeholder: "",
    type: "number",
    key: "quantidade",
  },
  {
    label: "Selecione o Arquivo (.pdf ou .jpg/png)",
    placeholder: "Selecione o Arquivo",
    type: "file",
    key: "arquivo",
  },
];

export const Form = () => {
  const [formData, setFormData] = useState({
    nome: "",
    chave: "",
    quantidade: "",
    arquivo: null,
  });

  const [tableData, setTableData] = useState<
    { nome: string; chave: string; quantidade: string; arquivo: null }[]
  >([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTableData((prevData) => [...prevData, formData]);
    setFormData({
      nome: "",
      chave: "",
      quantidade: "",
      arquivo: null,
    });
    console.log(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preencha com as informações solicitadas</CardTitle>
        <CardDescription>
          Ao criar as placas, elas ficarão disponíveis automáticamente para
          download e também ao TI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-2 gap-6">
              {InputGroup.map((input, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 items-center justify-center text-center"
                >
                  <Label className="text-center">{input.label}</Label>
                  <Input
                    autoComplete="off"
                    type={input.type}
                    placeholder={input.placeholder}
                    name={input.key}
                    value={
                      input.type !== "file"
                        ? formData[input.key as keyof typeof formData] ?? ""
                        : ""
                    }
                    onChange={handleChange}
                    className="text-center"
                  />
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center">
              <Button type="submit">Inserir Placa</Button>
            </div>
          </form>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NOME</TableHead>
                  <TableHead>CHAVE</TableHead>
                  <TableHead>ARQUIVO</TableHead>
                  <TableHead>QUANTIDADE</TableHead>
                  <TableHead>AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.nome}</TableCell>
                    <TableCell>{data.chave}</TableCell>
                    <TableCell>
                      {data.arquivo
                        ? (data.arquivo as { name: string }).name
                        : ""}
                    </TableCell>
                    <TableCell>{data.quantidade}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          setTableData((prevData) =>
                            prevData.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
