import { CardSectors } from "./cards/sectors";
import { CardUsers } from "./cards/users";


export const ContainerAdmin = () => {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
                <CardUsers />
            </div>
            <div className="flex flex-col">
                <CardSectors />
            </div>
        </div>
    );
};