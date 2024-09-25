"use client";

import {
  Card,
  CardContent,
  CardDescription,
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
import { z } from "zod";
import { Input } from "@/components/ui/input";
import LoadingButton from "../../../loading-button";
import { VerifyUser } from "@/app/(auth)/_actions/auth";
import { useState } from "react";
import { QrCodeForm } from "../qrcode/qrcode-form";

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

export interface PrivateUser {
  email: string;
  password: string;
}

export default function LoginTab() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const { toast } = useToast();
  const [user, setUser] = useState<PrivateUser | null>(null);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setUser(values);
      const result = await VerifyUser(values);

      if (!result) {
        throw new Error("Resposta inesperada do servidor");
      }

      setQrCodeUrl(result.qrCodeUrl || "...");
      console.log(qrCodeUrl);

      toast({
        title: result.title,
        description: result.message,
        variant: result.variant as
          | "destructive"
          | "success"
          | "default"
          | null
          | undefined,
      });
    } catch (error) {
      console.error("Erro durante a verificação do usuário:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
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
                <LoadingButton
                  pending={form.formState.isSubmitting}
                  disabled={!!qrCodeUrl}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        {qrCodeUrl && <QrCodeForm user={user!} qrCodeUrl={qrCodeUrl} />}
      </Card>
    </TabsContent>
  );
}
