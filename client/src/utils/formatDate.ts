import { isToday } from "./isToday";

export const formatDate = (dateString: Date): string => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  let month = date.getMonth().toString();
  let day = date.getDate().toString();
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();

  hours = hours.length < 2 ? "0" + hours : hours;
  minutes = minutes.length < 2 ? "0" + minutes : minutes;
  day = day.length < 2 ? `0${day}` : day;
  month = month.length < 2 ? `0${month}` : month;

  if (isToday(date)) {
    return `Aujourd'hui ${hours}:${minutes}`;
  } else {
    return `${day}/${month}/${year}`;
  }
};
