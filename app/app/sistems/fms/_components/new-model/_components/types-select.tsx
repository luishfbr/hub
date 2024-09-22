import { FieldTypeOptions } from "@/app/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface TypesSelectProps {
  onTypeSelect: (type: string | null) => void;
}

export const TypesSelect: React.FC<TypesSelectProps> = ({ onTypeSelect }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypeSelect = (value: string) => {
    setSelectedType(value);
    onTypeSelect(value);
  };

  return (
    <Select required onValueChange={handleTypeSelect}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Selecione um Tipo" />
      </SelectTrigger>
      <SelectContent>
        {FieldTypeOptions.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
