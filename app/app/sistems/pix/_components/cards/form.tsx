"use client";

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
import { useForm } from "react-hook-form";
import { useState } from "react";
import jsQR from "jsqr";
import qrcode from "qrcode";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const inputGroup = [
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
    label: "Selecione o Arquivo (.jpg/.png)",
    placeholder: "Selecione o Arquivo",
    type: "file",
    key: "arquivo",
  },
];

interface QRCodeForm {
  nome: string;
  chave: string;
  quantidade: string;
  arquivo: FileList;
}

export const ListQrCodeForms = ({
  onSubmitForm,
  onDeleteForm,
}: {
  onSubmitForm: (data: {
    nome: string;
    chave: string;
    quantidade: string;
    qrCodeData: string;
  }) => void;
  onDeleteForm: (index: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QRCodeForm>();
  const [qrCodeData, setQrCodeData] = useState("");
  const [formList, setFormList] = useState<QRCodeForm[]>([]);

  const onSubmit = async (data: QRCodeForm) => {
    const { nome, chave, quantidade, arquivo } = data;

    if (arquivo && arquivo[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result as string;

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = image.width;
          canvas.height = image.height;

          if (context) {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const qrCode = jsQR(
              imageData.data,
              imageData.width,
              imageData.height
            );

            if (qrCode) {
              qrcode
                .toDataURL(qrCode.data)
                .then((qrCodeFormatted) => {
                  setQrCodeData(qrCodeFormatted);
                  console.log("QR code gerado:", qrCodeFormatted);
                  setFormList((prevList) => [
                    ...prevList,
                    { nome, chave, quantidade, arquivo },
                  ]);
                  onSubmitForm({
                    nome,
                    chave,
                    quantidade,
                    qrCodeData: qrCodeFormatted,
                  });
                })
                .catch((error) => {
                  console.error("Erro ao gerar o QR code:", error);
                  setQrCodeData("Erro ao gerar o QR code.");
                });
            } else {
              setQrCodeData("Nenhum QR code detectado.");
            }
          }
        };
      };
      reader.readAsDataURL(arquivo[0]);
    }
  };

  const handleDelete = (index: number) => {
    setFormList((prevList) => prevList.filter((_, i) => i !== index));
    onDeleteForm(index);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preencha com as informações solicitadas</CardTitle>
        <CardDescription>
          Ao criar as placas, elas ficarão disponíveis automaticamente para
          download e também ao TI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <form
            className="flex flex-col gap-6 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-2 gap-6">
              {inputGroup.map((input) => (
                <div
                  key={input.key}
                  className="flex flex-col gap-2 items-center justify-center text-center"
                >
                  <Label className="text-center">{input.label}</Label>
                  <Input
                    autoComplete="off"
                    type={input.type}
                    placeholder={input.placeholder}
                    {...register(input.key as keyof QRCodeForm, {
                      required: true,
                    })}
                    accept={
                      input.type === "file"
                        ? "image/png, image/jpeg"
                        : undefined
                    }
                  />
                  {errors[input.key as keyof QRCodeForm] && (
                    <span className="text-red-500">
                      Este campo é obrigatório
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center">
              <Button type="submit">Inserir Placa</Button>
            </div>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Chave</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formList.map((form, index) => (
                <TableRow key={index}>
                  <TableCell>{form.nome}</TableCell>
                  <TableCell>{form.chave}</TableCell>
                  <TableCell>{form.quantidade}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(index)}>Deletar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
