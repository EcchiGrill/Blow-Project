import { useForm, SubmitHandler } from "react-hook-form";
import { ILoginForm } from "../types";
import { fetchUser, loginUser } from "@/store/slices/user-slice";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

export const useLogin = () => {
  const nav = useNavigate();
  const { isPending, isBackToLogin, dispatch } = useUser();
  const tabsBefore = window.history.state.idx;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();

  const emailError = errors["email"]?.message;
  const passwordError = errors["password"]?.message;

  const loginHandler: SubmitHandler<ILoginForm> = () => {
    dispatch(loginUser()).then(({ meta }) => {
      if (meta.requestStatus === "rejected") return;

      if (!tabsBefore) {
        nav("/");
      } else {
        nav(-1);
      }

      dispatch(fetchUser());
    });
  };

  const submitForm = () => handleSubmit(loginHandler);

  return {
    register,
    emailError,
    passwordError,
    submitForm,
    isBackToLogin,
    isPending,
    tabsBefore,
  };
};
