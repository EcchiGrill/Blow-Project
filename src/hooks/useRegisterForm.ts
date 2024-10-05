import { useForm, SubmitHandler } from "react-hook-form";
import { IRegisterForm } from "@/types";
import { useAppDispatch } from "@/store/store-hooks";
import { registerUser } from "@/store/slices/user-slice";
import { useNavigate } from "react-router-dom";

export const useRegisterForm = () => {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

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

  const submitRegister: SubmitHandler<IRegisterForm> = () => {
    dispatch(registerUser());
    nav("/");
  };

  const submitForm = () => handleSubmit(submitRegister);

  return {
    register,
    usernameError,
    fullNameError,
    emailError,
    passwordError,
    submitForm,
  };
};
