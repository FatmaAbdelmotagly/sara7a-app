import { createClient } from "redis"
import { REDIS_URI } from "../config.js";

export const client = createClient({
  url: REDIS_URI
});



export async function redisConnection (){
    try {
        await client.connect() 
        console.log("redis connected ❤️");
    } catch (error) {
        console.log(error ,"fail to connect with redis");
    }
}



// import { createClient } from "redis";
// import { REDIS_URI } from "../config.js";

// console.log(
//   "Redis URL loaded:",
//   REDIS_URI?.startsWith("rediss://")
// );

// const client = createClient({
//   url: REDIS_URI
// });

// client.on("error", (error) => {
//   console.error("Redis Client Error:", error.message);
// });

// export async function redisConnection() {
//   await client.connect();
//   console.log("redis connected ❤️");
// }