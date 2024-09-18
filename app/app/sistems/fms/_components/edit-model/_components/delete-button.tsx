import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function DeleteButton({ modelId }: { modelId: string }) {
  return (
    <Button variant="ghost" size="icon">
      <Trash className="h-4 w-4" />
    </Button>
  );
}
