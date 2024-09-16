import { redirect, RedirectType } from "next/navigation";
import { AuthForm } from "./(src)/_components/auth";
import { auth } from "@/services/auth";

export default async function Home() {
  let loggedIn = false;
  try {
    const session = await auth();
    if (session) {
      loggedIn = true;
    }
  } catch (error) {
    console.log("Home", error);
  } finally {
    if (loggedIn) {
      redirect("/sistems", RedirectType.replace);
    }
  }
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-primary">
      <AuthForm />
    </div>
  );
}
