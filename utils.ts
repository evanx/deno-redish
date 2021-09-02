import * as Colors from "https://deno.land/std/fmt/colors.ts";
import { Redis } from "https://deno.land/x/redis/mod.ts";

export function matchGroup(string: string, regex: RegExp) {
  const matcher = string.match(regex);
  return matcher ? matcher.pop() : null;
}

export function exitOk() {
  Deno.exit(0);
}

export function exitWithErrorText(text: string) {
  printInfoHeader(text);
  printInfoFooter();
  Deno.exit(1);
}

export function printInfoHeader(text: string) {
  console.error(Colors.blue(text));
}

export function printInfoFooter() {
  console.error(Colors.gray("See https://github.com/evanx/redish"));
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

export async function scanRedisKeys(
  redis: Redis,
  pattern: string,
  {
    cursor = 0,
    count = 10,
    type = "",
    redisVersion = "5",
  },
) {
  if (type && parseInt(redisVersion[0]) >= 6) {
    const [_, keys] = await redis.scan(cursor, {
      pattern,
      count,
      type,
    });
    return keys;
  } else {
    const [_, keys] = await redis.scan(cursor, {
      pattern,
      count,
    });
    return keys.filter((key) => key.endsWith(":h"));
  }
}
