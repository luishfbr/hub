import { FaFileDownload } from "react-icons/fa";

export function Logo() {
  return (
    <div className="flex justify-center items-center text-center gap-2">
      <div className="bg-primary h-8 w-8 flex items-center justify-center rounded-md">
        <FaFileDownload className="w-6 h-6 text-primary-foreground" />
      </div>
      <p className="font-bold text-xl text-primary">FMS DeVfont</p>
    </div>
  );
}
