import { Logout } from "@/app/(auth)/_actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { Session } from "next-auth";

type UserDropdownProps = {
  user: Session["user"];
};

export function UserDropdown({ user }: UserDropdownProps) {
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className="relative h-8 flex items-center justify-between w-full space-x-2 !px-0"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image as string} alt={user.name as string} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col flex-1 space-y-1 text-left">
            {user.name && (
              <p className="text-xs font-medium leading-none">{user.name}</p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 sm:w-72" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => Logout()}>
          <LockClosedIcon className="w-3 h-3 mr-3" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
