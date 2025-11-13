import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "school-redis",
  port: process.env.REDIS_PORT || 6379,
});

redis.on("connect", () => console.log("🔌 Redis connected"));
redis.on("error", (err) => console.log("❌ Redis Error:", err));

export default redis;
