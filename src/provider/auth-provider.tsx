import { useCookie } from "react-use";
import supabase from "@/supabase/supabase-client";
import { PropsWithChildren, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import {
  fetchUser,
  selectLogged,
  selectRemember,
  setSession,
} from "@/store/slices/user-slice";

function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSessionCookie, deleteSessionCookie] = useCookie("session");

  const remember = useAppSelector(selectRemember);
  const isLogged = useAppSelector(selectLogged);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!remember && !isLogged)
          setSessionCookie(data.session?.access_token || "");

        dispatch(
          setSession({
            session: data.session,
            isLogged: data.session ? true : false,
          })
        );

        if (data.session) dispatch(fetchUser());

        supabase.auth.onAuthStateChange((_, session) => {
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
