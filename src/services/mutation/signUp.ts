import { getURL } from "@/utils/getUrl";
import { supabase } from "@/utils/superbase/client";
import { useMutation } from "@tanstack/react-query";

interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
}

const signUpAction = async ({ email, password, name }: SignUpRequest) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: getURL(),
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useSignUpMutation = () =>
  useMutation({
    mutationFn: signUpAction,
  });
