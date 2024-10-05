import {
  selectEmail,
  selectFullname,
  selectLogged,
  selectPassword,
  selectUsername,
} from "@/store/slices/user-slice";
import { useAppDispatch, useAppSelector } from "@/store/store-hooks";

export const useUser = () => {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector(selectLogged);
  const fullName = useAppSelector(selectFullname);
  const username = useAppSelector(selectUsername);
  const email = useAppSelector(selectEmail);
  const password = useAppSelector(selectPassword);

  return {
    dispatch,
    isLogged,
    fullName,
    username,
    email,
    password,
  };
};
