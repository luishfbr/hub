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
import { FormNewMeeting } from "./forms/form";
import { ListMeetings } from "./meetings/meetings";

export function Main() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [meetingName, setMeetingName] = useState<string>("");
  const [refreshMeetings, setRefreshMeetings] = useState<boolean>(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSetName = (name: string) => {
    setMeetingName(name);
    console.log(meetingName);
  };

  const triggerRefreshMeetings = () => {
    setRefreshMeetings((prev) => !prev);
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
        <div className="grid grid-cols-2 gap-6">
          <CalendarSection onDateSelect={handleDateSelect} />
          <FormNewMeeting
            meetingCreated={triggerRefreshMeetings}
            selectedDate={selectedDate}
            onSetName={handleSetName}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <ListMeetings refreshMeetings={refreshMeetings} />{" "}
          <Card className="h-[50vh]"></Card>
        </div>
      </CardContent>
    </Card>
  );
}
