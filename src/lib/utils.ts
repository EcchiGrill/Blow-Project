import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ICreateToast, useStateSetter } from "./types";
import toast from "react-hot-toast";
import * as nsfwjs from "nsfwjs";
import { NSFW_PERCENTAGE } from "./constants";

//Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseDate = (dateString: string | undefined): Date =>
  new Date(Date.parse(dateString!));

export const getShortDesc = (description: string, length: number = 100) => {
  if (description.length < length) return description;

  const sliced = description.slice(0, length);
  const shortenArr = sliced.split(" ");

  if (shortenArr.length === 1) return sliced.padEnd(sliced.length + 3, ".");

  shortenArr.pop();
  const shorten = shortenArr.join(" ");

  return shorten.padEnd(shorten.length + 3, ".");
};

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

export const checkNSFW = async (
  img: HTMLImageElement,
  setLoading: useStateSetter<boolean>
) => {
  setLoading(true);

  const model = await nsfwjs.load("MobileNetV2");
  const predictions = await model.classify(img, 3);

  predictions.forEach((p) => console.log(p.className, p.probability));

  setLoading(false);

  return predictions.find(
    (p) =>
      (p.className === "Hentai" && p.probability * 100 > NSFW_PERCENTAGE) ||
      (p.className === "Porn" && p.probability * 100 > NSFW_PERCENTAGE)
  )
    ? true
    : false;
};
