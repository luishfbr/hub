import { CardSectors } from "./cards/sectors";
import { CardUsers } from "./cards/users";

export const ContainerAdmin = () => {
  return (
    <div className="h-full max-h-screen grid grid-cols-2 gap-6 overflow-auto">
      <CardUsers />
      <CardSectors />
    </div>
  );
};
