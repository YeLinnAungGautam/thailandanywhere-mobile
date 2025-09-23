import { format } from "date-fns";
export function getFormatDate(dateInput) {
  // Handle string date input by converting to Date object
  if (dateInput != null) {
    let date;
    if (typeof dateInput === "string") {
      date = new Date(dateInput);
    } else {
      date = dateInput;
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const options = {
      year: "numeric",
      month: "short", // Use "short" for abbreviated month names (Jan, Feb, etc.)
      day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  } else {
    return "Invalid Date";
  }
}

export function formattedDate(dateInput) {
  if (dateInput != null) {
    const date = new Date(dateInput);

    // Get year
    const year = date.getFullYear();

    // Get month and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0");

    // Get day and pad with leading zero if needed
    const day = String(date.getDate()).padStart(2, "0");

    // Return in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  }
  return null;
}

export function formattedDateTime(dateInput) {
  const date = new Date(dateInput);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${month} ${day}, ${year} / ${date.getHours()}:${date.getMinutes()}`;
}

export function changeFormat(dateStr) {
  if (dateStr) {
    return format(new Date(dateStr), "dd MMMM, YYY");
  } else {
    return "";
  }
}

export const formattedNumber = (number) => {
  if (number) {
    return new Intl.NumberFormat().format(number);
  } else {
    return 0;
  }
};

export function formattedDateTimeDB(dateInput) {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) throw new Error("Invalid date");

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return dateInput;
  }
}
