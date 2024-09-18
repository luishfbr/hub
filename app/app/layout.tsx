import { PropsWithChildren } from "react";
import { auth } from "@/services/auth";
import styles from "@/app/styles/main.module.css";
import { redirect } from "next/navigation";
import { MainSidebar } from "./_components/main-sidebar";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className={styles.layout}>
      <MainSidebar user={session?.user} />
      <main>{children}</main>
    </div>
  );
}
