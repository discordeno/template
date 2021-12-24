export function snowflakeToTimestamp(id: bigint) {
  return Number(id / 4194304n + 1420070400000n);
}

/** This function should be used when you want to convert milliseconds to a human readable format like 1d5h. */
export function humanizeMilliseconds(milliseconds: number) {
  const years = Math.floor(milliseconds / Milliseconds.Year);
  const months = Math.floor(
    (milliseconds % Milliseconds.Year) / Milliseconds.Month,
  );
  const weeks = Math.floor(
    ((milliseconds % Milliseconds.Year) % Milliseconds.Month) /
      Milliseconds.Week,
  );
  const days = Math.floor(
    (((milliseconds % Milliseconds.Year) % Milliseconds.Month) %
      Milliseconds.Week) / Milliseconds.Day,
  );
  const hours = Math.floor(
    ((((milliseconds % Milliseconds.Year) % Milliseconds.Month) %
      Milliseconds.Week) % Milliseconds.Day) /
      Milliseconds.Hour,
  );
  const minutes = Math.floor(
    (((((milliseconds % Milliseconds.Year) % Milliseconds.Month) %
      Milliseconds.Week) % Milliseconds.Day) %
      Milliseconds.Hour) /
      Milliseconds.Minute,
  );
  const seconds = Math.floor(
    ((((((milliseconds % Milliseconds.Year) % Milliseconds.Month) %
      Milliseconds.Week) % Milliseconds.Day) %
      Milliseconds.Hour) %
      Milliseconds.Minute) /
      Milliseconds.Second,
  );

  const YearString = years ? `${years}y ` : "";
  const monthString = months ? `${months}mo ` : "";
  const weekString = weeks ? `${weeks}w ` : "";
  const dayString = days ? `${days}d ` : "";
  const hourString = hours ? `${hours}h ` : "";
  const minuteString = minutes ? `${minutes}m ` : "";
  const secondString = seconds ? `${seconds}s ` : "";

  return (
    `${YearString}${monthString}${weekString}${dayString}${hourString}${minuteString}${secondString}`
      .trimEnd() || "1s"
  );
}

export enum Milliseconds {
  Year = 1000 * 60 * 60 * 24 * 30 * 12,
  Month = 1000 * 60 * 60 * 24 * 30,
  Week = 1000 * 60 * 60 * 24 * 7,
  Day = 1000 * 60 * 60 * 24,
  Hour = 1000 * 60 * 60,
  Minute = 1000 * 60,
  Second = 1000,
}
