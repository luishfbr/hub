"use client"

import { useEffect, useState } from "react";
import { getName } from "../_actions/initial";
import { Rocket } from 'lucide-react';

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
            <div className="flex justify-center items-center gap-2">
                <Rocket className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">Seja bem-vindo(a), {name}</h1>
            </div>
            <div></div>
        </div>
    );
}
