import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, LoaderIcon, Undo2 } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/lib/hooks/useUser";
import {
  setEmail,
  setPassword,
  setCaptcha,
  setIsBackToLogin,
  getResetLink,
} from "@/store/slices/user-slice";
import { CAPTCHA_TOKEN } from "@/lib/constants";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { FormEvent, useEffect, useState } from "react";
import AuthContainer from "./auth-container";
import { useLogin } from "@/lib/hooks/useLogin";

function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isReset, setReset] = useState(false);
  const { dispatch, email, password, captchaRef, error } = useUser();
  const {
    register,
    submitForm,
    emailError,
    passwordError,
    isBackToLogin,
    tabsBefore,
    isPending,
  } = useLogin();

  const goBack = () => {
    if (isBackToLogin || !tabsBefore) {
      dispatch(setIsBackToLogin(false));
      return nav("/");
    }
    return nav(-1);
  };

  const toggleReset = () => {
    setReset(!isReset);
  };

  const handleReset = (e: FormEvent) => {
    e.preventDefault();
    dispatch(getResetLink(email)).then(
      ({ meta }) => meta.requestStatus === "fulfilled" && nav("/")
    );
  };

  useEffect(() => {
    if (error) captchaRef.current?.resetCaptcha();
  }, [error, captchaRef]);

  return (
    <AuthContainer goBack={goBack}>
      <Card className="m-4 w-full max-w-[23rem] z-10 bg-secondary-muted border-none">
        <CardHeader>
          <a
            className="w-min cursor-pointer hover:rotate-12 transition duration-300"
            onClick={goBack}
          >
            <Undo2 width={28} height={28} />
          </a>
          <CardTitle className="text-2xl font-bold text-center">
            {isReset ? "Reset your password" : "Login into Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isReset
              ? "Type connected email to reset your password"
              : "Sign in to get started with Blow Project"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <form onSubmit={isReset ? handleReset : submitForm()}>
            <div className="space-y-4 mb-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    onChange: (e) => dispatch(setEmail(e.target.value)),
                    required: "This field is required!",
                    value: email,
                  })}
                />
                {emailError && <p className="text-error">{emailError}</p>}
              </div>
              {!isReset && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      {...register("password", {
                        onChange: (e) => dispatch(setPassword(e.target.value)),
                        required: "This field is required!",
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute text-black hover:bg-transparent focus:outline-none right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        isPasswordVisible
                          ? setPasswordVisible(false)
                          : setPasswordVisible(true)
                      }
                    >
                      {isPasswordVisible ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {isPasswordVisible ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {passwordError && (
                    <p className="text-error">{passwordError}</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end px-1">
              <a
                className="text-sm font-normal hover:opacity-75 transition duration-300 cursor-pointer"
                onClick={() => toggleReset()}
              >
                {isReset ? "Back to Login" : "Forgot your password?"}
              </a>
            </div>

            <div className="mt-5 w-full flex place-content-center">
              <HCaptcha
                ref={captchaRef}
                sitekey={`${CAPTCHA_TOKEN}`}
                onVerify={(token) => dispatch(setCaptcha(token))}
              />
            </div>
            {!isReset ? (
              <div className="w-full text-center mt-5">
                <Button className="w-2/5" type="submit" disabled={isPending}>
                  {isPending && (
                    <LoaderIcon className="animate-spin h-5 w-5 mr-1 mt-0.5" />
                  )}
                  {isPending ? "Logging..." : "Log in"}
                </Button>
              </div>
            ) : (
              <div className="w-full text-center mt-5">
                <Button className="w-2/5" type="submit" disabled={isPending}>
                  {isPending && (
                    <LoaderIcon className="animate-spin h-5 w-5 mr-1 mt-0.5" />
                  )}
                  {isPending ? "Sending..." : "Send link"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col -mt-2">
          <p className="text-sm text-center dark:text-gray-400">
            Don't have an account?
            <NavLink
              to="/register"
              className="text-blue-500 font-semibold ml-2 hover:underline"
              state={{ register: location }}
            >
              Register
            </NavLink>
          </p>
        </CardFooter>
      </Card>
    </AuthContainer>
  );
}

export default Login;
