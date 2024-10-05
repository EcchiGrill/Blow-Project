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
import { EyeIcon, EyeOffIcon, Undo2 } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useLoginForm } from "@/hooks/useLoginForm";
import {
  setEmail,
  setPassword,
  setCaptcha,
  setIsBackToLogin,
} from "@/store/slices/user-slice";
import { captchaToken, emailRegEx, passwordRegEx } from "@/constants";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useState } from "react";

function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const [isPasswordVisible, setPasswordVisible] = useState(true);
  const { dispatch, email, password } = useUser();
  const {
    register,
    submitForm,
    emailError,
    passwordError,
    isBackToLogin,
    tabsBefore,
  } = useLoginForm();

  const goBack = () => {
    if (isBackToLogin || !tabsBefore) {
      dispatch(setIsBackToLogin(false));
      return nav("/");
    }
    return nav(-1);
  };

  return (
    <>
      <div className="fixed w-screen min-h-screen flex place-content-center place items-center">
        <Card className="m-4 w-full max-w-md z-10 bg-secondary-muted border-none">
          <CardHeader>
            <a className="w-min cursor-pointer" onClick={goBack}>
              <Undo2 width={28} height={28} />
            </a>
            <CardTitle className="text-2xl font-bold text-center">
              Login into Account
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to get started with Blow Project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitForm()}>
              <div className="space-y-4">
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
                        value: emailRegEx,
                        message: "Invalid email adress",
                      },
                    })}
                  />
                  {emailError && <p className="text-error">{emailError}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password", {
                        onChange: (e) => dispatch(setPassword(e.target.value)),
                        required: "This field is required!",
                        value: password,
                        pattern: {
                          value: passwordRegEx,
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
                  {passwordError && (
                    <p className="text-error">{passwordError}</p>
                  )}
                </div>
              </div>
              <div className="mt-5 w-full flex place-content-center">
                <HCaptcha
                  sitekey={`${captchaToken}`}
                  onVerify={(token) => dispatch(setCaptcha(token))}
                />
              </div>
              <div className="w-full text-center mt-5">
                <Button className="w-1/5" type="submit">
                  Log in
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-center dark:text-gray-400">
              Don't have an account?
              <NavLink
                to="/register"
                className="text-blue-500 ml-2 hover:underline"
                state={{ register: location }}
              >
                Register
              </NavLink>
            </p>
          </CardFooter>
        </Card>
        <div
          className="w-full absolute h-screen bg-gray-400 opacity-50"
          onClick={goBack}
        />
      </div>
    </>
  );
}

export default Login;
