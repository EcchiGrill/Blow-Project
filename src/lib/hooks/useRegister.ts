import { useForm, SubmitHandler } from "react-hook-form";
import { IRegisterForm } from "../types";
import { registerUser, setOTPConfirm } from "@/store/slices/user-slice";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

export const useRegister = () => {
  const nav = useNavigate();
  const { isPending, dispatch } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterForm>({
    mode: "onChange",
  });

  const usernameError = errors["username"]?.message;
  const fullNameError = errors["fullName"]?.message;
  const emailError = errors["email"]?.message;
  const passwordError = errors["password"]?.message;

  const registerHandler: SubmitHandler<IRegisterForm> = () => {
    dispatch(registerUser()).then((action) => {
      if (action.meta.requestStatus === "rejected") return;

      dispatch(setOTPConfirm(true));

      nav("confirmation");
    });
  };

  const submitForm = () => {
    return handleSubmit(registerHandler);
  };

  return {
    register,
    usernameError,
    fullNameError,
    emailError,
    passwordError,
    submitForm,
    isPending,
  };
};
