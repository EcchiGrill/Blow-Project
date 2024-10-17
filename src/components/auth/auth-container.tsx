import { AuthContainerProps } from "@/lib/types";

function AuthContainer({ nav, goBack, children }: AuthContainerProps) {
  return (
    <div className="fixed w-screen min-h-screen flex place-content-center place-items-center">
      <>{children}</>
      <div
        className="w-full absolute h-screen bg-gray-400 opacity-50"
        onClick={goBack ? goBack : () => nav!("/")}
      />
    </div>
  );
}

export default AuthContainer;
