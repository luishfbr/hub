import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Login } from "../tabsauth/login"
import { Register } from "../tabsauth/register"

export function AuthForm() {
    return (
        <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
            <Login />
            <Register />
        </Tabs>
    )
}
