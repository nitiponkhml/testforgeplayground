// Optional Redis client. Connects ONLY when REDIS_URL is set; otherwise every
// helper is a no-op so the app keeps working without a cache.
// Connection is attempted lazily and cached as a promise, so a single attempt
// is shared and a failure never crashes the app.

import { createClient } from "redis";
import { logError } from "./logger";

function buildClient() {
  return createClient({ url: process.env.REDIS_URL });
}

// Derive the client type from an actual createClient(...) call so it matches
// the inferred generics exactly (redis v6 is strict about RESP version, etc.).
type RedisClient = ReturnType<typeof buildClient>;

let clientPromise: Promise<RedisClient | null> | null = null;

export function isRedisEnabled(): boolean {
  return Boolean(process.env.REDIS_URL);
}

export function getRedis(): Promise<RedisClient | null> {
  if (!process.env.REDIS_URL) return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = (async () => {
      try {
        const client = buildClient();
        // A registered 'error' listener prevents unhandled exceptions if Redis
        // drops; node-redis will retry the connection on its own.
        client.on("error", (err) => logError("redis", err));
        await client.connect();
        return client;
      } catch (err) {
        logError("redis connect", err);
        return null;
      }
    })();
  }
  return clientPromise;
}

/** Increment a counter and return the new value, or null if Redis is absent. */
export async function incr(key: string): Promise<number | null> {
  const client = await getRedis();
  if (!client) return null;
  try {
    return await client.incr(key);
  } catch (err) {
    logError("redis incr", err);
    return null;
  }
}
