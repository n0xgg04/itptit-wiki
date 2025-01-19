import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const remember = async function <T>(
    key: string,
    fn: (...args: any[]) => Promise<T> | T,
    isJson = false,
): Promise<T> {
    try {
        const cached = await redis.get(key);

        if (cached !== null) {
            if (isJson) {
                return JSON.parse(cached as string) as T;
            }
            return cached as T; // Trả về dữ liệu nguyên thủy
        }

        const data = await fn();

        if (isJson) {
            await redis.set(key, JSON.stringify(data));
        } else {
            await redis.set(key, data);
        }

        return data;
    } catch (error) {
        console.error("Error in remember function:", error);
        throw error;
    }
};

export default redis;
