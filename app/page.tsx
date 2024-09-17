import { auth } from "@/services/auth";

import { redirect } from "next/navigation";
import AuthForm from "./(auth)/_components/auth/_components/auth-form";

export default async function Page() {
  const session = await auth();

  if (session) {
    return redirect("/app/sistems");
  }

  return <AuthForm />;
}
