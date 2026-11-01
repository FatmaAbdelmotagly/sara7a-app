import { createClient } from "redis";
import { REDIS_URI } from "../config.js";

export const client = createClient({
  url: REDIS_URI,
});

export async function redisConnection() {
  try {
    await client.connect();
    console.log("redis connected ❤️");
  } catch (error) {
    console.log(error, "fail to connect with redis");
  }
}
