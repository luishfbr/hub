"use client";

import { Demo } from "./cards/demo";
import { Form } from "./cards/form";

export const Main = () => {
  return (
    <div className="grid grid-cols-2 gap-6 h-[90vh] sm:max-h-[85vh]">
      <Form />
      <Demo />
    </div>
  );
};
