import { CornerDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ErrorBoundary() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col place-content-center place-items-center px-1 gap-4 text-center w-screen h-screen text-xs lg:text-base">
      <h1 className="text-red-500">Oops.. This page doesn't seem to exist</h1>
      <a
        onClick={() => navigate(-1)}
        className="text-3xl cursor-pointer text-secondary flex underline flex-row place-items-center gap-2"
      >
        Go back
        <CornerDownRight className="text-xl self-end" />
      </a>
    </div>
  );
}

export default ErrorBoundary;
