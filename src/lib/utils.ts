import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ICreateToast } from "./types";
import toast from "react-hot-toast";

//Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createToast = ({
  text,
  icon,
  color,
  pos = "bottom-right",
}: ICreateToast) => {
  toast(`${text}`, {
    duration: 2500,
    style: { color: `${color}`, paddingRight: "2px" },
    icon: `${icon}`,
    position: `${pos}`,
  });
};
