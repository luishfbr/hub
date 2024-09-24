import { CardSectors } from "./cards/sectors";
import { CardUsers } from "./cards/users";

export const ContainerAdmin = () => {
  return (
    <div className="xl:max-h-[85vh] lg:max-h-[75vh] sm:max-h-[65vh] grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardUsers />
      <CardSectors />
    </div>
  );
};
