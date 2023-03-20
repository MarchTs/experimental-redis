export interface IKeyValueStore<K extends string> {
    get(key: K): Promise<string>;
    set(key: K, value: string, ...options: any[]): Promise<string>;
    delete(key: K): Promise<void>;
}
