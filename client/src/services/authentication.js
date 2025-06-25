import { supabase } from "./supabaseClient";

export const signUp = async (email, password) => {
  return await supabase.auth.signUp({
    email: email,
    password: password,
  });
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getuser = async () => {
  return await supabase.auth.getUser();
};
