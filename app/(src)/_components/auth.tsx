import { Button } from "@/components/ui/button";
import { github } from "../_actions/auth";

export function AuthForm() {
  return (
    <div>
      <form action={github}>
        <Button>Logar com Github</Button>
      </form>
    </div>
  );
}
