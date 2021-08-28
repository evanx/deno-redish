import * as Colors from "https://deno.land/std/fmt/colors.ts";

export function exitWithErrorText(text: string) {
  console.error(text);
  Deno.exit(1);
}

export function unflattenRedis(array: string[]): Map<String, String> {
  const map = new Map();
  for (let index = 0; index < array.length; index += 2) {
    map.set(array[index], array[index + 1]);
  }
  return map;
}

export function formatFields(
  key: string,
  value: string,
  options = { colorize: true },
) {
  const columns = formatColumns(key, value);
  if (options.colorize) {
    columns[0] = Colors.cyan(columns[0]);
    columns[1] = Colors.white(columns[1]);
    if (columns[2]) {
      columns[2] = Colors.gray(columns[2]);
    }
  }
  return columns.join(" ");
}

function formatColumns(key: string, value: string) {
  const columns = [];
  columns.push(key);
  columns.push(value);
  if (/^1[6-9][0-9]{11}$/.test(value)) {
    columns.push((new Date(parseInt(value))).toISOString());
  }
  return columns;
}
