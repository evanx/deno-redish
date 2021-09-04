import { connect } from "https://deno.land/x/redis/mod.ts";
import {
  exitOk,
  exitWithErrorText,
  formatFields,
  matchGroup,
  printInfoHeader,
  scanRedisKeys,
  unflattenRedis,
} from "./utils.ts";

const redis = await connect({
  hostname: "127.0.0.1",
  port: 6379,
});

const redisVersion = matchGroup(
  await redis.info(),
  /\bredis_version:(\d\.\d+)/,
);

if (Deno.args.length === 0) {
  const keys = await scanRedisKeys(redis, "*", { type: "hash", limit: 10 });
  if (!keys.length) {
    exitWithErrorText(
      "Usage: <key, prefix or pattern>",
    );
  }
  printInfoHeader(`Found matching hashes keys:`);
  console.log(keys.join("\n"));
  exitOk();
}
const argKey = Deno.args[0];
const type = await redis.type(argKey);
if (type === "hash") {
  await processKey(argKey);
  exitOk();
}
const pattern = argKey.includes("*") ? argKey : `${argKey}*`;
const keys = await scanRedisKeys(redis, pattern, {
  limit: 10,
  type: "hash",
});
if (keys.length === 0) {
  exitWithErrorText("No matching keys");
}
if (keys.length > 1) {
  printInfoHeader(`Found matching keys:`);
  console.log(keys.join("\n"));
  exitOk();
}
const foundKey = keys[0];
printInfoHeader(`Found key: ${foundKey}`);
await processKey(foundKey);
exitOk();

async function processKey(key: string) {
  if (Deno.args.length === 1) {
    await hgetall(key);
  } else {
    const fieldNames = Deno.args.slice(1);
    await hmget(key, fieldNames);
  }
}

async function hgetall(key: string) {
  const res = unflattenRedis(await redis.hgetall(key));
  console.log(
    Array.from(res.entries()).map(([key, value]) =>
      formatFields(String(key), String(value))
    ).join("\n"),
  );
}

async function hmget(key: string, fieldNames: string[]) {
  const res = await redis.hmget(key, ...fieldNames);
  console.log(
    res.map((value, index) => formatFields(fieldNames[index], String(value)))
      .join(
        "\n",
      ),
  );
}
