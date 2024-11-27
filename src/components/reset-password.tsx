import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, EyeIcon, EyeOffIcon, KeyRound, LoaderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContainer from "./auth/auth-container";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/lib/store-hooks";
import { createToast } from "@/lib/utils";
import { PASSWORD_REGEX } from "@/lib/constants";
import { resetPassword, setReset } from "@/store/slices/user-slice";
import supabase from "@/supabase/supabase-client";
import { useUser } from "@/lib/hooks/useUser";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);

  const { isPending } = useUser();
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({
    mode: "onChange",
  });

  const passwordError = errors["password"]?.message;

  const [value, setValue] = useState({
    password1: "",
    password2: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  const submitHandler: SubmitHandler<{
    password: string;
  }> = () => {
    if (value.password1 !== value.password2) {
      return createToast({
        text: "Password must match each other",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
    }
    dispatch(resetPassword(value.password1)).then(({ meta }) => {
      if (meta.requestStatus === "fulfilled") signOut();
    });
  };

  return (
    <AuthContainer
      goBack={() => {
        dispatch(setReset(false));
        nav("/");
      }}
    >
      <Card className="m-4 w-full max-w-[23rem] z-10 bg-secondary-muted border-none">
        <CardHeader>
          <div className="flex place-items-center space-x-2">
            <KeyRound className="h-6 w-6" />
            <CardTitle className="text-2xl font-bold mb-1">
              Reset Password
            </CardTitle>
          </div>
          <CardDescription>
            Enter new password to reset your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={value.password1}
                    {...register("password", {
                      onChange: (e) =>
                        setValue((prev) => {
                          return {
                            ...prev,
                            password1: e.target.value,
                          };
                        }),
                      pattern: {
                        value: PASSWORD_REGEX,
                        message: "Invalid password",
                      },
                    })}
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute text-black hover:bg-transparent focus:outline-none right-1 top-1/2 transform -translate-y-1/2"
                    onClick={() => togglePasswordVisibility()}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password2">Confirm Password</Label>
                <Input
                  id="password2"
                  type="password"
                  placeholder="Confirm your new password"
                  value={value.password2}
                  onChange={(e) =>
                    setValue((prev) => {
                      return {
                        ...prev,
                        password2: e.target.value,
                      };
                    })
                  }
                  required
                />
              </div>
            </div>
            {passwordError ? (
              <p className="text-error">{passwordError}</p>
            ) : (
              <ul className="mt-2">
                <span>Your password must: </span>
                <li className="mt-2">
                  <Check className="w-5 mr-2 inline-block" />
                  Be at least 8 characters
                </li>
                <li>
                  <Check className="w-5 mr-2 inline-block" />
                  Include at least one uppercase letter
                </li>
                <li>
                  <Check className="w-5 mr-2 inline-block" />
                  Include at least one number
                </li>
              </ul>
            )}
            <div className="w-full text-center mt-5">
              <Button className="w-2/5" type="submit" disabled={isPending}>
                {isPending && (
                  <LoaderIcon className="animate-spin h-5 w-5 mr-1 mt-0.5" />
                )}
                {isPending ? "Reseting..." : "Reset password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthContainer>
  );
}

export default ResetPassword;
