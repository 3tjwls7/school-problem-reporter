import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "school-redis", // "redis"
  port: process.env.REDIS_PORT || "6379", // "6379"
});

redis.on("connect", () => console.log("🔌 Redis connected"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

export default redis;
