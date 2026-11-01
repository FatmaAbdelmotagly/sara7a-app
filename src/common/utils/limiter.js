import geoip from "geoip-lite";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { client } from "../../DB/redisConnection.js";
import { successResponse } from "./successResponse.js";

function fromWhere(ip) {
  try {
    return geoip.lookup(ip);
  } catch (error) {
    console.log(error);
  }
}

export const generateLimiter = ({
  limit = 1000,
  ttl = 15,
  message = "too many requests",
  status = 429,
  standardHeaders = "draft-8",
  skipFailedRequests,
  skipSuccessfulRequests,
  legacyHeaders = true,
}) => {
  return rateLimit({
    windowMs: ttl * 60 * 1000,
    standardHeaders,
    skipFailedRequests,
    skipSuccessfulRequests,
    legacyHeaders,

    limit: function (req) {
      const data = fromWhere(req.ip);
      console.log({ data });
      const isLocal = ["::1", "127.0.0.1", "::ffff:127.0.0.1"].includes(req.ip);

      console.log({
        ip: req.ip,
        country: data?.country,
        isLocal,
      });

      return isLocal || data?.country === "EG" ? limit : 0;
    },

    handler: function (req, res, next) {
      successResponse({ message, res, status });
    },

    keyGenerator: function (req) {
      const ip = ipKeyGenerator(req.ip, 52);
      return `${ip}::${req.path}`;
    },

    store: {
      async increment(key) {
        try {
          const count = await client.incr(key);

          if (count === 1) {
            await client.expire(key, ttl * 60);
          }

          const remainingTime = await client.ttl(key);

          return {
            totalHits: count,
            resetTime:
              remainingTime >= 0
                ? new Date(Date.now() + remainingTime * 1000)
                : undefined,
          };
        } catch (err) {
          throw err;
        }
      },

      async decrement(key) {
        if (await client.exists(key)) {
          await client.decr(key);
        }
      },

      async resetKey(key) {
        await client.del(key);
      },
    },
  });
};
