"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GenerateQrCode, VerifyQrCode } from "../../_actions/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export function QrCodeForm() {
    const id = useSearchParams().get('id')

    if (!id) {
        return <div>Erro ao obter o ID</div>;
    }

    const [qrCode, setQrCode] = useState<string | null>(null);

    useEffect(() => {
        const fetchQrCode = async () => {
            const response = await GenerateQrCode(id)
            setQrCode(response)
        };
        fetchQrCode();
    }, [id]);

    return (
        <div className="flex justify-center items-center h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>QR Code</CardTitle>
                    <CardDescription>
                        Escaneie o QR Code para verificar o login.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Image src={qrCode || ""} alt="QR Code" width={256} height={256} />
                </CardContent>
                <form action={VerifyQrCode}>
                    <CardFooter>
                        <Input type="text" name="code" />
                        <Button>Verificar</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}