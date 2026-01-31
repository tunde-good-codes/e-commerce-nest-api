import Redis from "ioredis";

export const REDIS_CLIENT = "REDIS_CLIENT";

export const redisProvider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
    });

    client.on("connect", () => {
      console.log("✅ Redis connected");
    });

    client.on("error", (err) => {
      console.error("❌ Redis error", err);
    });

    return client;
  },
};
