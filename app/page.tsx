import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { AuthForm } from "./(src)/_components/auth";

export default async function Home() {
  let loggedIn = false;
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

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
