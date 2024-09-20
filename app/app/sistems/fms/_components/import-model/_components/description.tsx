"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function DescriptionHelp() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant={"outline"}>Preciso de Ajuda</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto">
        <p>
          Os arquivos .xlsx não podem conter espaços em branco. Substitua cada
          espaço em branco por "null".
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
