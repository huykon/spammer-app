import { useOutletContext } from "@remix-run/react";
import type { SupabaseOutletContent } from "~/root";

const Login = () => {
  const { supabase } = useOutletContext<SupabaseOutletContent>();
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) console.log(error);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
  };

  return (
    <>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Login;
