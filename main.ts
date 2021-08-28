import { connect } from "https://deno.land/x/redis/mod.ts";
import { exitWithErrorText, formatFields, unflattenRedis } from "./utils.ts";

const redis = await connect({
  hostname: "127.0.0.1",
  port: 6379,
});

if (Deno.args.length === 0) {
  exitWithErrorText("Usage: <key pattern>");
}

const [_, keys] = await redis.scan(0, {
  count: 8,
  pattern: `${Deno.args[0]}*`,
});
if (keys.length === 0) {
  exitWithErrorText("No matching keys");
}
if (keys.length > 1) {
  exitWithErrorText(`Matching keys:\n${keys.join("\n")}`);
}
if (keys.length === 1) {
  const [key] = keys;
  if (Deno.args.length === 1) {
    const res = unflattenRedis(await redis.hgetall(key));
    console.log(
      Array.from(res.entries()).map(([key, value]) =>
        formatFields(String(key), String(value))
      ).join("\n"),
    );
  }
}
