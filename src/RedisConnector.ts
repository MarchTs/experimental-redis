import { createClient, RedisClientType } from "redis";

export interface IRedisConnectionConfig {
    url: string;
    username?: string;
    password?: string;
}

export class RedisConnector {
    public get isReady() {
        return this.client.isReady;
    }

    private maxRetry = 3;
    private retry = 0;

    public client: RedisClientType;

    constructor(config: IRedisConnectionConfig) {
        this.client = createClient(config);
    }

    public async init() {
        this.subscribeRedis();
        await this.client.connect();
    }

    public async subscribeRedis() {
        this.client.on("connect", () => {
            console.log("initiating redis connection");
        });

        this.client.on("ready", () => {
            console.log("Connected to Redis");
        });

        this.client.on("error", (err: Error) => {
            console.log("Redis Error: " + err.message);
            if (this.retry === this.maxRetry) {
                Promise.reject("Redis exceeded retry connection.");
                this.client.disconnect();
            }
        });

        this.client.on("end", () => {
            console.log("End redis connection");
        });

        this.client.on("reconnecting", () => {
            console.log("reconnecting redis connection");
            this.retry += 1;
        });
    }
}
