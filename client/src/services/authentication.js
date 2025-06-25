import { supabase } from "./supabaseClient";

export const signUp = (email, password) =>
  supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: "John",
      },
    },
  });

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
