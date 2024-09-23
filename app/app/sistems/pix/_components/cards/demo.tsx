"use client";

import { Card } from "@/components/ui/card";
import styles from "@/app/styles/main.module.css";
import { QrCode } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface GridItemProps {
  children: React.ReactNode;
}

const GridItem: React.FC<GridItemProps> = ({ children }) => (
  <div className="border-2 border-black p-4 aspect-square">{children}</div>
);

export const Demo = () => {
  const name = "Luis Henrique Fonte Boa Romualdo";
  const key = "703.157.656-31";

  const truncatedName = name.length > 25 ? name.slice(0, 25) + "..." : name;
  const truncatedKey = key.length > 25 ? key.slice(0, 25) + "..." : key;

  return (
    <Card className="p-4">
      <div className={styles.folha}>
        <div className="grid grid-cols-2 gap-8 p-8">
          {[...Array(6)].map((_, index) => (
            <GridItem key={index}>
              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                <QrCode className="text-black w-[85%] h-[85%]" />
                <span className="text-black text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {truncatedName}
                </span>
                <span className="text-black text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {truncatedKey}
                </span>
              </div>
            </GridItem>
          ))}
        </div>
      </div>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
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
