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

function formatFieldColors(key: string, value: string) {
  const columns = [];
  columns.push(Colors.cyan(key));
  columns.push(Colors.white(value));
  if (/^1[6-9][0-9]{11}$/.test(value)) {
    columns.push(Colors.gray(new Date(parseInt(value)).toISOString()));
  }
  return columns.join(" ");
}

function formatFieldPlain(key: string, value: string) {
  const columns = [];
  columns.push(key);
  columns.push(value);
  if (/^1[6-9][0-9]{11}$/.test(value)) {
    columns.push(new Date(parseInt(value)).toISOString());
  }
  return columns.join(" ");
}

export function formatField(
  key: string,
  value: string,
  options = { colorize: true },
) {
  if (options.colorize) {
    return formatFieldColors(key, value);
  } else {
    return formatFieldPlain(key, value);
  }
}
