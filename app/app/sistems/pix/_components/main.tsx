"use client";

import { useState } from "react";
import { Demo } from "./cards/demo";
import { ListQrCodeForms } from "./cards/form";
import { Carousel } from "@/components/ui/carousel";

interface QRCodeForm {
  nome: string;
  chave: string;
  quantidade: number;
  qrCodeData: string;
}

export const Main = () => {
  const [qrCodeDataList, setQrCodeDataList] = useState<QRCodeForm[]>([]);

  const handleFormSubmit = (data: QRCodeForm) => {
    setQrCodeDataList((prevList) => [...prevList, data]);
  };

  const handleDeleteForm = (index: number) => {
    setQrCodeDataList((prevList) => prevList.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-[90vh] sm:max-h-[85vh]">
      <ListQrCodeForms
        onSubmitForm={(data) =>
          handleFormSubmit({ ...data, quantidade: Number(data.quantidade) })
        }
        onDeleteForm={handleDeleteForm}
      />
      <Carousel>
        {qrCodeDataList.map((qrCodeData, index) => (
          <Demo key={index} qrCodeData={qrCodeData} />
        ))}
      </Carousel>
    </div>
  );
};
