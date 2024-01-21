import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}


export function timeAgo(date:Date|string) {
  const currentDate = new Date();
  const targetDate = new Date(date);

  let years = currentDate.getFullYear() - targetDate.getFullYear();
  let months = currentDate.getMonth() - targetDate.getMonth();

  // Adjust for year boundary
  if (currentDate < new Date(targetDate.getFullYear() + years, targetDate.getMonth(), targetDate.getDate())) {
      years--;
  }

  // Adjust for month boundary
  if (months < 0 && years > 0) {
      years--;
      months += 12; // Add 12 months as we moved one year back
  }

  if (years > 0) return years === 1 ? '1y' : `${years}y`;

  if (months > 0) return months === 1 ? '1mo' : `${months}mo`;

  let timeDifference = Number(currentDate) - Number(targetDate); // Remaining difference in milliseconds

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  if (days > 0) return days === 1 ? '1d' : `${days}d`;

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  if (hours > 0) return hours === 1 ? '1h' : `${hours}h`;

  const minutes = Math.floor(timeDifference / (1000 * 60));
  if (minutes > 0) return minutes === 1 ? '1m' : `${minutes}m`;

  const seconds = Math.floor(timeDifference / 1000);
  return seconds === 1 ? '1s' : `${seconds}s`;
}
