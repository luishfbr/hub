import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-background w-full h-full">
      <Loader2 className="animate-spin w-12 h-12" />
    </div>
  );
};
