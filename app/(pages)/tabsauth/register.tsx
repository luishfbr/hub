import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import { register } from "../_actions/auth"

export const Register = () => {
    return (
        <TabsContent value="register">
            <Card>
                <CardHeader>
                    <CardTitle>Registrar</CardTitle>
                    <CardDescription>
                        Registre-se para ter acesso aos nossos serviços
                    </CardDescription>
                </CardHeader>
                <form action={register}>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input required id="name" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input required id="email" type="email" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Senha</Label>
                            <Input required id="password" type="password" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword">Confirmação de Senha</Label>
                            <Input required id="confirmPassword" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Registrar</Button>
                    </CardFooter>
                </form>
            </Card>
        </TabsContent>
    )
}