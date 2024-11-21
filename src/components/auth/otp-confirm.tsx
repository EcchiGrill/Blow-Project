import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowRight, LoaderIcon, Mail, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContainer from "./auth-container";
import {
  confirmEmail,
  fetchUser,
  setOTP,
  setOTPConfirm,
} from "@/store/slices/user-slice";
import { useForm } from "react-hook-form";
import { useUser } from "@/lib/hooks/useUser";
import supabase from "@/supabase/supabase-client";
import { createToast } from "@/lib/utils";

function OTPConfirm() {
  const nav = useNavigate();

  const { dispatch, isPending, otp, email } = useUser();

  const { register, handleSubmit } = useForm();

  const resendEmail = async () => {
    await supabase.auth
      .resend({
        type: "signup",
        email: email,
      })
      .then(() => {
        createToast({
          text: "Sent another confirm email!",
          icon: "🟢",
          color: "green",
          pos: "top-center",
        });
      });
  };

  const confirmHandler = () => {
    dispatch(confirmEmail()).then(() => {
      nav("/");
      dispatch(fetchUser());
    });
  };

  const submitForm = () => {
    return handleSubmit(confirmHandler);
  };

  return (
    <AuthContainer nav={nav}>
      <Card className="mx-5 w-full relative max-w-md z-10 min-h-[28rem] bg-secondary-muted border-none">
        <a
          className="w-min absolute top-6 left-6 cursor-pointer hover:rotate-12 transition duration-300"
          onClick={() => {
            dispatch(setOTPConfirm(false));
            nav("/");
          }}
        >
          <Undo2 width={28} height={28} />
        </a>
        <CardHeader className="mt-16">
          <CardTitle className="text-2xl font-bold text-center">
            Email Confirmation
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitForm()}>
            <div className="space-y-4">
              <div className="flex place-content-center">
                <InputOTP
                  maxLength={6}
                  {...(register("otp"),
                  {
                    value: otp,
                    onChange: (e) => dispatch(setOTP(e)),
                  })}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending && (
                  <LoaderIcon className="animate-spin h-5 w-5 mr-1 mt-0.5" />
                )}
                {isPending ? "Verifying..." : "Verify"}
                {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex w-full absolute bottom-3 flex-col space-y-4">
          <div className="text-sm text-center text-primary dark:text-gray-400">
            Didn't receive the code?
            <a
              className="text-blue-500 font-semibold ml-2 hover:underline cursor-pointer"
              onClick={resendEmail}
            >
              Resend
            </a>
          </div>
          <div className="flex items-center font-semibold justify-center text-sm text-primary dark:text-gray-400">
            <Mail className="mr-2 h-4 w-4" />
            Check your spam folder if you don't see the email
          </div>
        </CardFooter>
      </Card>
    </AuthContainer>
  );
}

export default OTPConfirm;
