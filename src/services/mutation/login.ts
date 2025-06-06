import { supabase } from "@/utils/superbase/client";
import { useMutation } from "@tanstack/react-query";

interface SignInRequest {
  email: string;
  password: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
}

const signInAction = async ({ email, password }: SignInRequest) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useLogInMutation = () =>
  useMutation({
    mutationFn: signInAction,
  });
