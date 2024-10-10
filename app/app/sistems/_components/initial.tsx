"use client"

import { useEffect, useState } from "react";
import { getName } from "../_actions/initial";

export function InitialPage() {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserName = async () => {
            const userName = await getName();
            setName(userName as string);
        };
        fetchUserName();
    }, []);

    return (
        <div className="flex flex-col gap-12 w-full">
            <div className="flex flex-col justify-center items-center text-center">
                <h1 className="text-2xl font-bold text-primary">Seja bem-vindo(a), {name}</h1>
                <span className="text-muted-foreground">Bem-vindo(a) ao Hub de Sistemas do Sicoob Uberaba, um aglomerado de sistemas em um só lugar. Veja os exemplos e dicas abaixo.</span>
            </div>
        </div>
    );
}
