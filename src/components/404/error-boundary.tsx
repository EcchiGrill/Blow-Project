import { CornerDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ErrorBoundary({
  msg = "Oops.. This page doesn't seem to exist",
}: {
  msg?: string;
}) {
  const nav = useNavigate();

  return (
    <div className="flex flex-col place-content-center place-items-center px-1 gap-4 text-center w-full h-screen text-xs lg:text-base">
      <h1 className="text-error">{msg}</h1>
      <a
        onClick={() => nav("/")}
        className="text-3xl cursor-pointer text-secondary flex underline flex-row place-items-center gap-2"
      >
        Go back
        <CornerDownRight className="text-xl self-end" />
      </a>
    </div>
  );
}

export default ErrorBoundary;
