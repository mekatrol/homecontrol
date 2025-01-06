export interface ValidationResult {
  field: string;
  message: string;
}

const validateRegex = (value: string, re: RegExp): RegExpMatchArray | null => {
  // Just in case an undefined/null value is passed
  if (!value) {
    return null;
  }

  const matches = value.match(re);

  return matches;
};

export const validateUuid = (uuid: string): boolean => {
  const matches = validateRegex(uuid, /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);

  if (!matches) {
    return false;
  }

  return matches[0] == uuid;
};

export const validateInterval = (interval: string): boolean => {
  if (!interval) {
    return false;
  }

  const matches = /^(\d*)\.{0,1}([0-9]{2}):([0-9]{2}):([0-9]{2})$/.exec(interval);

  if (!matches) {
    return false;
  }

  const [match, dys, hrs, mins, secs] = matches;

  const days = parseInt(dys);
  const hours = parseInt(hrs);
  const minutes = parseInt(mins);
  const seconds = parseInt(secs);

  if ((!!dys && isNaN(days)) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    return false;
  }

  if (hours > 23 || minutes > 59 || seconds > 59) {
    return false;
  }

  return match == interval;
};
