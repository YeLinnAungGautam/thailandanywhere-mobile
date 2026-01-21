import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function formatMessageTime(date) {
  const messageDate = new Date(date);

  if (isToday(messageDate)) {
    return format(messageDate, "HH:mm");
  } else if (isYesterday(messageDate)) {
    return "Yesterday " + format(messageDate, "HH:mm");
  } else {
    return format(messageDate, "MMM dd, HH:mm");
  }
}

export function formatLastSeen(date) {
  if (!date) return "Never";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatConversationTime(date) {
  const conversationDate = new Date(date);

  if (isToday(conversationDate)) {
    return format(conversationDate, "HH:mm");
  } else if (isYesterday(conversationDate)) {
    return "Yesterday";
  } else {
    return format(conversationDate, "MMM dd");
  }
}
