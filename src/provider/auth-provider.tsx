import { useCookie } from "react-use";
import supabase from "@/supabase/supabase-client";
import { PropsWithChildren, useEffect } from "react";
import { useAppDispatch } from "@/store/lib/store-hooks";
import { fetchProfile, fetchUser, setSession } from "@/store/slices/user-slice";

function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSessionCookie, deleteSessionCookie] = useCookie("session");

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSessionCookie(data.session?.access_token || "");
        dispatch(
          setSession({
            session: data.session,
            isLogged: !data.session ? false : true,
          })
        );

        if (data.session)
          dispatch(fetchUser()).then(() => dispatch(fetchProfile()));

        supabase.auth.onAuthStateChange((event, session) => {
          setSessionCookie(session?.access_token || "");
          if (event === "SIGNED_OUT") deleteSessionCookie();
          setSession({
            session: event == "SIGNED_OUT" ? null : session,
            isLogged: event == "SIGNED_OUT" ? false : true,
          });
        });
      })
      .catch((error) => {
        deleteSessionCookie();
        setSession({
          session: null,
          isLogged: false,
        });
        throw new Error(error.message);
      });
  }, [dispatch, setSessionCookie, deleteSessionCookie]);

  return <>{children}</>;
}

export default AuthProvider;
