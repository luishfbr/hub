"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import styles from "@/app/styles/main.module.css";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface GridItemProps {
  children: React.ReactNode;
}

const GridItem: React.FC<GridItemProps> = ({ children }) => (
  <div className="border-2 border-black p-4 aspect-square">{children}</div>
);

interface DemoProps {
  qrCodeData: {
    nome: string;
    chave: string;
    quantidade: number;
    qrCodeData: string;
  } | null;
}

export const Demo: React.FC<DemoProps> = ({ qrCodeData }) => {
  const name = qrCodeData?.nome || "";
  const key = qrCodeData?.chave || "";
  const itemsPerPage = 6;

  const truncatedName = name.length > 25 ? `${name.slice(0, 25)}...` : name;
  const truncatedKey = key.length > 25 ? `${key.slice(0, 25)}...` : key;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (qrCodeData?.quantidade) {
      setTotalPages(Math.ceil(qrCodeData.quantidade / itemsPerPage));
    }
  }, [qrCodeData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderQrCodes = () => {
    if (!qrCodeData?.quantidade) return null;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const qrCodesToShow = Array.from({ length: qrCodeData.quantidade }).slice(
      startIndex,
      endIndex
    );

    return qrCodesToShow.map((_, index) => (
      <GridItem key={index}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
          <Image
            src={qrCodeData.qrCodeData}
            alt="QR Code"
            className="w-[75%] h-[75%] object-contain"
          />
          <span className="text-black text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {truncatedName}
          </span>
          <span className="text-black text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {truncatedKey}
          </span>
        </div>
      </GridItem>
    ));
  };

  return (
    <Card className="p-4">
      <div className={styles.folha}>
        <div className="grid grid-cols-2 gap-8 p-8">{renderQrCodes()}</div>
      </div>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
                isActive={currentPage > 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
                isActive={currentPage < totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="flex items-center justify-center mt-2">
        <Button>Enviar ao TI</Button>
      </div>
    </Card>
  );
};
