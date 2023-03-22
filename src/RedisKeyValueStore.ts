import { RedisConnector } from "RedisConnector";
import { IKeyValueStore } from "./IKeyValueStore";

// export const RedisStoreToken = new Token<RedisKeyValueStore>();

export abstract class RedisKeyValueStore<T extends string> implements IKeyValueStore<T> {
    constructor(private redisConnector: RedisConnector) {}

    public async set(key: string, value: string, timeout?: number): Promise<string> {
        if (!this.redisConnector.isReady) {
            await this.redisConnector.init();
        }

        return await this.redisConnector.client.set(key, value, {
            EX: timeout,
        });
    }

    public async get(key: string): Promise<string> {
        if (!this.redisConnector.isReady) {
            await this.redisConnector.init();
        }
        return this.redisConnector.client.get(key) as Promise<string>;
    }

    public async delete(key: string): Promise<void> {
        if (!this.redisConnector.isReady) {
            await this.redisConnector.init();
        }
        await this.redisConnector.client.del(key);
    }

    public async deleteWhere(keyCondition: string): Promise<void> {
        if (!this.redisConnector.isReady) {
            await this.redisConnector.init();
        }
        console.log(`Deleting keys where:`, keyCondition);
        const keys = await this.redisConnector.client.keys(keyCondition);
        console.log(`Keys to delete:`, keys);
        await this.redisConnector.client.del([...keys]);
    }
}

export class RedisProjectLevelCacheStore<T extends string = string> extends RedisKeyValueStore<T> {
    constructor(redisConnector: RedisConnector, readonly projectId: string, readonly prefix?: string) {
        super(redisConnector);
        this.projectId = projectId;
    }

    public getKey(resource: T): string {
        return `${this.prefix ? this.prefix + "-" : ""}${this.projectId}-${resource}` as string;
    }

    public async get<V = any>(resource: T): Promise<V> {
        const result: string = await super.get(this.getKey(resource));
        return JSON.parse(result) as Promise<V>;
    }

    public async set<V>(resource: T, value: V, ttl: number = 300000): Promise<T> {
        return (await super.set(this.getKey(resource), JSON.stringify(value), ttl)) as T;
    }

    public async delete(resource: T): Promise<void> {
        const key = this.getKey(resource);
        console.log(`Deleting key:`, key);
        await super.delete(key);
    }
}
