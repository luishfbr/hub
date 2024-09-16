import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from "./tabs/login";
import { RegisterTab } from "./tabs/register";

export function AuthForm() {
  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Registre-se</TabsTrigger>
      </TabsList>
      <LoginTab />
      <RegisterTab />
    </Tabs>
  );
}
