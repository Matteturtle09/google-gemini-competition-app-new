import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function initials(str: string) {
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

  let initials = [...str.matchAll(rgx)] || [];

  initials = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();
  return initials
}

export function getDisplayName(str: string) {
  var displayName = str;

  if (str?.includes("@")) {
    const match = str.match(/^[^@]+/)
    if (match) {
      const firstPart = match[0];
      displayName = firstPart.replace(/\./g, ' ');
      return displayName;
    }

  }else{
    return displayName;
  }
}