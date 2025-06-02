import React from "react";
import { Signup } from "./signup-form";

const signUp = () => {
  return (
    <div className="flex w-full items-center justify-center h-screen">
      <div className="w-full p-4 max-w-4xl">
        <Signup />
      </div>
    </div>
  );
};

export default signUp;
