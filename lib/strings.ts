export function pad (subject: string, width: number, padChar: string) {
  padChar = padChar || '0';
  subject = subject + '';
  if (subject.length >= width) {
    return subject;
  }
  return new Array(width - subject.length + 1).join(padChar) + subject;
}

export function shortenString (subject: string, maxLength: number, addEllipsis?: "addEllipsis") {
  if (!subject) {
    return "";
  }
  if (maxLength >= subject.length) {
    return subject;
  }
  let trimmedString = subject.substring(0, maxLength);
  trimmedString = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
  return trimmedString + (addEllipsis ? "..." : "");
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
