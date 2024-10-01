"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { CalendarSection } from "./_calendar/calendar-section";
import { useState } from "react";

export function Main() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log("Data selecionada:", date);
    console.log(selectedDate);
  };

  return (
    <Card className="w-full h-[75vh] md:h-[80vh] lg:h-[83vh] xl:h-[89vh]">
      <CardHeader>
        <CardTitle>Reuniões Direx</CardTitle>
        <CardDescription>
          Aqui você pode gerenciar as reuniões da direx, inclua reuniões no
          calendário, e selecione colaboradores que farão parte de determinadas
          reuniões.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-6">
          <CalendarSection onDateSelect={handleDateSelect} />
          <CalendarSection onDateSelect={handleDateSelect} />
          <CalendarSection onDateSelect={handleDateSelect} />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Card className="h-[50vh]">
            <CardHeader>
              <CardTitle>Lista de Reuniões</CardTitle>
              <CardDescription>Inclua acima uma nova reunião.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="h-[50vh] col-span-2"></Card>
        </div>
      </CardContent>
    </Card>
  );
}
