"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/zod";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import RegisterUser from "@/app/(auth)/_actions/register";
import { useToast } from "../../../../utils/ToastContext";

type RegisterFormData = z.infer<typeof registerSchema>;

interface CreateButtonProps {
    onCreateSuccess: () => void;
}

export const CreateNewUser: React.FC<CreateButtonProps> = ({
    onCreateSuccess,
}) => {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await RegisterUser(data);
            if (response === true) {
                onCreateSuccess();
                reset();
                showToast("Usuário registrado com sucesso!");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">Criar novo usuário</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-lg p-4 sm:p-6">
                <DialogHeader></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                {...register("name")}
                                type="text"
                                required
                                autoComplete="off"
                                className="w-full"
                            />
                            {errors.name && (
                                <p className="text-red-700 text-sm">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                {...register("email")}
                                type="email"
                                required
                                autoComplete="off"
                                className="w-full"
                            />
                            {errors.email && (
                                <p className="text-red-700 text-sm">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                {...register("password")}
                                type="password"
                                required
                                className="w-full"
                            />
                            {errors.password && (
                                <p className="text-red-700 text-sm">{errors.password.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="passwordAgain">Digite Novamente</Label>
                            <Input
                                {...register("passwordAgain")}
                                type="password"
                                required
                                className="w-full"
                            />
                            {errors.passwordAgain && (
                                <p className="text-red-700 text-sm">
                                    {errors.passwordAgain.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <DialogClose>
                            <Button type="submit" disabled={isSubmitting || !isValid}>
                                {isSubmitting ? "Carregando..." : "Registrar"}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};