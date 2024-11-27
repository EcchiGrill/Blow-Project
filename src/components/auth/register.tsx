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
import { Check, EyeIcon, EyeOffIcon, LoaderIcon, Undo2 } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  setEmail,
  setFullname,
  setPassword,
  setUsername,
  setCaptcha,
  setIsBackToLogin,
} from "@/store/slices/user-slice";
import { useUser } from "@/lib/hooks/useUser";
import { useRegister } from "@/lib/hooks/useRegister";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { CAPTCHA_TOKEN, EMAIL_REGEX, PASSWORD_REGEX } from "@/lib/constants";
import { useEffect, useState } from "react";
import AuthContainer from "./auth-container";

function Register() {
  const nav = useNavigate();
  const location = useLocation();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const {
    dispatch,
    username,
    fullName,
    email,
    password,
    isOTPConfirm,
    captchaRef,
    error,
  } = useUser();
  const {
    register,
    usernameError,
    fullNameError,
    emailError,
    passwordError,
    submitForm,
    isPending,
  } = useRegister();

  useEffect(() => {
    if (error) captchaRef.current?.resetCaptcha();
  }, [error, captchaRef]);

  return !isOTPConfirm ? (
    <AuthContainer nav={nav}>
      <Card className="mx-5 w-full max-w-sm z-10 bg-secondary-muted border-none">
        <CardHeader>
          <a
            className="w-min cursor-pointer hover:rotate-12 transition duration-300"
            onClick={() => nav("/")}
          >
            <Undo2 width={28} height={28} />
          </a>
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to get started with Blow Project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitForm()}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    placeholder="Enter your username"
                    {...register("username", {
                      onChange: (e) => dispatch(setUsername(e.target.value)),
                      required: "This field is required!",
                      value: username,
                    })}
                  />
                </div>
                {usernameError && <p className="text-error">{usernameError}</p>}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    placeholder="Enter your full name"
                    {...register("fullName", {
                      onChange: (e) => dispatch(setFullname(e.target.value)),
                      required: "This field is required!",
                      value: fullName,
                    })}
                  />
                </div>
                {fullNameError && <p className="text-error">{fullNameError}</p>}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      onChange: (e) => dispatch(setEmail(e.target.value)),
                      required: "This field is required!",
                      value: email,
                      pattern: {
                        value: EMAIL_REGEX,
                        message: "Invalid email adress",
                      },
                    })}
                  />
                  {emailError && <p className="text-error">{emailError}</p>}
                </div>
              </div>
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
                      pattern: {
                        value: PASSWORD_REGEX,
                        message: "Invalid password",
                      },
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
                {passwordError ? (
                  <p className="text-error">{passwordError}</p>
                ) : (
                  <ul>
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
              </div>
            </div>
            <div className="mt-5 w-full flex place-content-center">
              <HCaptcha
                ref={captchaRef}
                sitekey={`${CAPTCHA_TOKEN}`}
                onVerify={(token) => dispatch(setCaptcha(token))}
              />
            </div>
            <div className="w-full text-center mt-4">
              <Button className="w-2/5" type="submit" disabled={isPending}>
                {isPending && (
                  <LoaderIcon className="animate-spin h-5 w-5 mr-1 mt-0.5" />
                )}
                {isPending ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col -mt-2">
          <p className="text-sm text-center dark:text-gray-400">
            Have an account?
            <NavLink
              to="/login"
              state={{ login: location }}
              className="text-blue-500 font-semibold ml-2 hover:underline"
              onClick={() => dispatch(setIsBackToLogin(true))}
            >
              Login
            </NavLink>
          </p>
        </CardFooter>
      </Card>
    </AuthContainer>
  ) : (
    <Outlet />
  );
}

export default Register;
