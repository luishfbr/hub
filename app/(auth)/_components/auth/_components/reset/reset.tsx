"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useForm } from "react-hook-form"
import { ResetFormValues } from "@/app/types/types"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { ChangePassword, VerifyForReset } from "@/app/(auth)/_actions/auth"
import { z } from "zod"
import { passwordSchemaReset } from "@/app/types/zod"

export function ResetForm() {
    const { watch } = useForm<ResetFormValues>();
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("")
    const [newPasswordAgain, setNewPasswordAgain] = useState<string>("")
    const { toast } = useToast();
    const [verified, setVerified] = useState(false);
    const [changeIsLoading, setChangeIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            if (!code || !email) {
                toast({
                    title: "Valores inválidos",
                    description: "Verifique os campos para alteração de senha, insira os dados corretos",
                    variant: "destructive",
                });
                return;
            }

            const data = {
                email: email,
                code: code
            }

            const res = await VerifyForReset(data);

            if (res === true) {
                setVerified(true);
                toast({
                    title: "Código verificado com sucesso",
                    description: "Insira os valores para a nova senha.",
                    variant: "success",
                });
            } else {
                toast({
                    title: "Código ou Email inválidos",
                    description: "Verifique os dados digitados",
                    variant: "destructive",
                });

                return
            }

        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = async () => {
        setChangeIsLoading(true);
        if (newPassword !== newPasswordAgain) {
            toast({
                title: "Senhas não coincidem",
                description: "Verifique as senhas digitadas",
                variant: "destructive",
            });
            return;
        }

        try {
            passwordSchemaReset.parse(newPassword);

            const data = {
                password: newPassword,
                confirmPassword: newPasswordAgain,
                email: email
            }

            const res = await ChangePassword(data)

            if (res === true) {
                toast({
                    title: "Senha alterada com sucesso",
                    description: "Sua senha foi alterada com sucesso.",
                    variant: "success",
                });
                setChangeIsLoading(false);
            } else {
                setChangeIsLoading(false);
                toast({
                    title: "Erro ao alterar senha",
                    description: "Verifique os dados digitados",
                    variant: "destructive",
                });
                return
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                toast({
                    title: "Erro de validação",
                    description: error.errors[0]?.message || "Erro desconhecido.",
                    variant: "destructive",
                });
            }
        }
    }

    const handleOTPChange = (value: string) => {
        setCode(value)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="link" className="w-full">Esqueci minha senha</Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
                {verified ? (
                    <div className="flex flex-col gap-6">
                        <p className="text-center text-xl font-bold">Insira sua nova senha</p>
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <Input type="password" placeholder="Digite sua nova senha" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
                            <Input type="password" placeholder="Digite sua nova senha novamente" onChange={(e) => setNewPasswordAgain(e.target.value)} value={newPasswordAgain} />
                        </div>
                        <Button onClick={handleChange} type="button">
                            {changeIsLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Alterar senha"}
                        </Button>
                    </div>
                ) : (
                    <form>
                        <div className="flex flex-col gap-6">
                            <span className="text-center text-sm text-muted-foreground">Insira seu email e seu código de 6 dígitos gerado no seu aplicativo Microsoft Authenticator.</span>
                            <div className="flex flex-col gap-2 items-center justify-center">
                                <Input placeholder="Digite seu email" onChange={(e) => setEmail(e.target.value)} value={email} />
                                <InputOTP
                                    maxLength={6}
                                    value={watch("code") || code}
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
                            </div>
                            <Button onClick={handleSubmit} type="button">
                                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verificar"}
                            </Button>
                        </div>
                    </form >
                )}
            </PopoverContent>
        </Popover >
    )
}
