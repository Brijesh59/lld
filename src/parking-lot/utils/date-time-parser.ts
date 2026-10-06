const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export class DateTimeParser {
  static parse(input: string): Date {
    const match = input.match(
      /^(\d{1,2}) ([A-Z][a-z]{2}) (\d{1,2}):(\d{2}) (AM|PM) (\d{4})$/,
    );

    if (!match) {
      throw new Error(
        `Invalid date format: "${input}". Expected "d MMM h:mm a yyyy".`,
      );
    }

    const [, dayRaw, monthRaw, hourRaw, minuteRaw, meridiem, yearRaw] = match;

    const month = MONTHS[monthRaw!];
    if (month === undefined) {
      throw new Error(`Invalid month: ${monthRaw}`);
    }

    let hour = Number(hourRaw);
    if (hour < 1 || hour > 12) {
      throw new Error(`Invalid hour: ${hourRaw}`);
    }

    if (meridiem === "AM" && hour === 12) {
      hour = 0;
    } else if (meridiem === "PM" && hour !== 12) {
      hour += 12;
    }

    return new Date(
      Number(yearRaw),
      month,
      Number(dayRaw),
      hour,
      Number(minuteRaw),
      0,
      0,
    );
  }
}
