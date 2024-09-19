"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/app/types/zod";
import { LoginForm } from "@/app/types/types";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import LoadingButton from "../../../loading-button";
import { LoginWithCredentials } from "@/app/(auth)/_actions/auth";

const inputs = [
  {
    id: "email",
    label: "Email",
    type: "email",
  },
  {
    id: "password",
    label: "Senha",
    type: "password",
  },
];

export default function LoginTab() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const response = await LoginWithCredentials(values);
      if (response && 'id' in response) {
        toast({
          title: "Login efetuado com sucesso",
          description: "Você será redirecionado para verificar o QR Code.",
          variant: "success",
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push(`/qrcode?id=${response.id}`);
      } else {
        toast({
          title: "Erro ao efetuar login",
          description: response.message,    
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("Ocorreu um erro inesperado. Por favor, tente novamente.");
    }
  };

  return (
    <TabsContent value="login">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Insira suas credenciais para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {inputs.map((value, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={value.id as keyof LoginForm}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{value.label}</FormLabel>
                      <FormControl>
                        <Input {...field} type={value.type} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <div className="mt-4">
                <LoadingButton pending={form.formState.isSubmitting} />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
