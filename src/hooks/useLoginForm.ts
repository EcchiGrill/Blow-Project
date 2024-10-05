import { useForm, SubmitHandler } from "react-hook-form";
import { ILoginForm } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/store-hooks";
import { loginUser, selectIsBackToLogin } from "@/store/slices/user-slice";
import { useNavigate } from "react-router-dom";

export const useLoginForm = () => {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const isBackToLogin = useAppSelector(selectIsBackToLogin);
  const tabsBefore = window.history.state.idx;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({
    mode: "onChange",
  });

  const emailError = errors["email"]?.message;
  const passwordError = errors["password"]?.message;

  const submitLogin: SubmitHandler<ILoginForm> = () => {
    dispatch(loginUser());
    if (!tabsBefore) return nav("/");
    nav(-1);
  };
  const submitForm = () => handleSubmit(submitLogin);

  return {
    register,
    emailError,
    passwordError,
    submitForm,
    isBackToLogin,
    tabsBefore,
  };
};
