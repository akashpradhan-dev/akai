import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface SignInRequest {
  email: string;
  password: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
}

interface SignInResponse {
  data: User;
  message: string;
  token: string;
}

const signInAction = async ({
  email,
  password,
}: SignInRequest): Promise<SignInResponse> => {
  const response = await axios.post("/api/sign-in", {
    email,
    password,
  });

  if (!response) {
    throw new Error("Failed to generate chart");
  }

  return response.data;
};

export const useSignInMutation = () =>
  useMutation({
    mutationFn: signInAction,
  });
