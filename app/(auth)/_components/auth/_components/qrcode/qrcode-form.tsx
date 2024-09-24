"use client";

import { CardFooter } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPSeparator,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { PrivateUser } from "../tabs/login";
import { useForm } from "react-hook-form";
import { qrCodeSchema } from "@/app/types/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Login, VerifyQrCode } from "@/app/(auth)/_actions/auth";
import { useToast } from "@/hooks/use-toast";

export function QrCodeForm({
  qrCodeUrl,
  user,
}: {
  qrCodeUrl: string;
  user: PrivateUser;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof qrCodeSchema>>({
    resolver: zodResolver(qrCodeSchema),
    defaultValues: {
      email: user.email,
      password: user.password,
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof qrCodeSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await VerifyQrCode(values);
      if (response.status === "success") {
        toast({
          title: "Sucesso",
          description: "QR Code verificado com sucesso",
          variant: "success",
        });
        await Login(values);
        router.push("/app/sistems");
      } else {
        toast({
          title: "Erro",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPChange = useCallback(
    (value: string) => {
      form.setValue("code", value);
    },
    [form]
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <CardFooter className="flex flex-col justify-center gap-4">
        <div className="mt-4">
          {qrCodeUrl === "..." ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin w-4 h-4" />
            </div>
          ) : (
            <Image src={qrCodeUrl} alt="QR Code" width={250} height={250} />
          )}
        </div>
        <InputOTP
          maxLength={6}
          value={form.watch("code")}
          onChange={handleOTPChange}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Verificar"
          )}
        </Button>
      </CardFooter>
    </form>
  );
}
