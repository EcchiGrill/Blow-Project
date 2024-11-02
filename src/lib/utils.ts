import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ICreateToast } from "./types";
import toast from "react-hot-toast";

//Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseDate = (dateString: string | undefined): Date =>
  new Date(Date.parse(dateString!));

export const getAgoDate = (date: string = new Date().toISOString()) => {
  const parsedDate = parseDate(date);
  const milliseconds = Date.now() - parsedDate.getTime();
  const seconds = Math.trunc(milliseconds / 1000);
  const minutes = Math.trunc(seconds / 60);
  const hours = Math.trunc(minutes / 60);
  const days = Math.trunc(hours / 24);

  if (days >= 1) {
    return `${days} days ago`;
  } else if (hours >= 1) {
    return `${hours} hours ago`;
  } else if (minutes >= 1) {
    return `${minutes} minutes ago`;
  } else {
    return `${seconds} seconds ago`;
  }
};

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
