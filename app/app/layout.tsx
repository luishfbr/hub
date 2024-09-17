import { PropsWithChildren } from "react";
import { auth } from "@/services/auth";

import { redirect } from "next/navigation";
import { MainSidebar } from "./_components/main-sidebar";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="h-screen grid grid-cols-[18rem_1fr] overflow-hidden">
      <MainSidebar user={session?.user} />
      <main className="overflow-hidden">{children}</main>
    </div>
  );
}
