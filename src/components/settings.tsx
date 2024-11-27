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
import { Switch } from "@/components/ui/switch";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/lib/constants";
import { useUser } from "@/lib/hooks/useUser";
import { createToast } from "@/lib/utils";
import {
  signOut,
  updateEmail,
  updatePassword,
} from "@/store/slices/user-slice";
import supabase from "@/supabase/supabase-client";
import {
  Check,
  CornerDownRight,
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
} from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Settings() {
  const nav = useNavigate();
  const location = useLocation();
  const { dispatch, isLogged, email, isPending } = useUser();
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    mode: "onChange",
  });

  const emailError = errors["email"]?.message;
  const passwordError = errors["password"]?.message;

  const [settings, setSettings] = useState({
    email,
    password1: "",
    password2: "",
  });

  const unAuth = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  const submitHandler: SubmitHandler<{
    email: string;
    password: string;
  }> = () => {
    if (settings.password1 && settings.password1 !== settings.password2) {
      return createToast({
        text: "Password must match each other",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
    }

    if (settings.email) {
      dispatch(updateEmail(settings.email));
      unAuth();
    }

    if (settings.password1) {
      dispatch(updatePassword(settings.password1));
      unAuth();
    }
  };

  return (
    <main
      className={
        "w-inherit sm:container mx-auto px-4 py-8 " +
        `${!isLogged && " flex place-items-center place-content-center"}`
      }
    >
      {isLogged ? (
        <>
          <Card>
            <form
              onSubmit={handleSubmit(submitHandler)}
              autoComplete="off"
              autoCapitalize="off"
            >
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-primary">
                      Receive email updates about your account
                    </p>
                  </div>
                  <Switch id="notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletter">Newsletter Subscription</Label>
                    <p className="text-sm text-primary">
                      Receive our weekly newsletter
                    </p>
                  </div>
                  <Switch id="newsletter" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="Your email address"
                    type="email"
                    value={settings.email}
                    {...register("email", {
                      onChange: (e) =>
                        setSettings((prev) => {
                          return { ...prev, email: e.target.value };
                        }),
                      pattern: {
                        value: EMAIL_REGEX,
                        message: "Invalid email adress",
                      },
                    })}
                  />
                  {emailError && <p className="text-error">{emailError}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Change Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="Enter new password"
                      type={isPasswordVisible ? "text" : "password"}
                      className="placeholder:text-primary"
                      value={settings.password1}
                      {...register("password", {
                        onChange: (e) =>
                          setSettings((prev) => {
                            return { ...prev, password1: e.target.value };
                          }),
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Confirm Password</Label>
                  <Input
                    id="password"
                    placeholder="Enter new password"
                    type="password"
                    required={settings.password1 ? true : false}
                    className="placeholder:text-primary"
                    onChange={(e) =>
                      setSettings((prev) => {
                        return { ...prev, password2: e.target.value };
                      })
                    }
                    value={settings.password2}
                  />
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
              </CardContent>
              <CardFooter className="flex flex-row-reverse gap-4">
                <Button
                  type="submit"
                  className="ml-auto text-secondary"
                  disabled={isPending}
                >
                  {isPending && (
                    <LoaderIcon className="animate-spin h-5 w-5 mr-1 mt-0.5" />
                  )}
                  {isPending ? "Saving..." : "Save Settings"}
                </Button>
                <Button
                  type="button"
                  variant={"destructive"}
                  disabled={isPending}
                  onClick={() => {
                    dispatch(signOut());
                    nav("/");
                  }}
                >
                  Sign Out
                </Button>
              </CardFooter>
            </form>
          </Card>
        </>
      ) : (
        <Link
          to="/login"
          className="text-error text-3xl flex underline flex-row place-items-center gap-2"
          state={{ login: location }}
        >
          Please login first <CornerDownRight className="text-xl self-end" />
        </Link>
      )}
    </main>
  );
}

export default Settings;
