import { useCookie } from "react-use";
import supabase from "@/supabase/supabase-client";
import { PropsWithChildren, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import {
  fetchUser,
  selectLogged,
  setReset,
  setSession,
} from "@/store/slices/user-slice";
import { fetchProfiles } from "@/store/slices/profile-slice";

function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSessionCookie, deleteSessionCookie] = useCookie("session");

  const isLogged = useAppSelector(selectLogged);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isLogged) setSessionCookie(data.session?.access_token || "");

        dispatch(
          setSession({
            session: data.session,
            isLogged: data.session ? true : false,
          })
        );

        if (data.session) {
          dispatch(fetchUser());
          dispatch(setReset(true));
        }

        dispatch(fetchProfiles());

        supabase.auth.onAuthStateChange(async (_, session) => {
          setSessionCookie(session?.access_token || "");
          if (!session) deleteSessionCookie();
          dispatch(
            setSession({
              session: !session ? null : session,
              isLogged: !session ? false : true,
            })
          );
        });
      })
      .catch((error) => {
        deleteSessionCookie();
        dispatch(
          setSession({
            session: null,
            isLogged: false,
          })
        );
        throw new Error(error.message);
      });
  }, [dispatch, setSessionCookie, deleteSessionCookie]);

  return <>{children}</>;
}

export default AuthProvider;
