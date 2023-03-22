import * as _ from "lodash";
import { IRedisConnectionConfig, RedisConnector } from "RedisConnector";
import { RedisProjectLevelCacheStore } from "RedisKeyValueStore";

enum ResourceEnum {
    RA = "RA1",
    RB = "RB1",
}

function getKey(resource: ResourceEnum, options: any = {}): string {
    return `${resource}` + (!_.isNil(options) ? `-${JSON.stringify(options)}` : "");
}

const main = async () => {
    const projectId1 = "project1";
    const projectId2 = "project2";
    const redisConfig: IRedisConnectionConfig = {
        url: "redis://localhost:6379",
    };
    const redisConnector = new RedisConnector(redisConfig);
    const keyValueStore1 = new RedisProjectLevelCacheStore(redisConnector, projectId1, "prefix");
    const keyValueStore2 = new RedisProjectLevelCacheStore(redisConnector, projectId2, "prefix");

    const key1 = keyValueStore1.getKey(ResourceEnum.RA);
    const key2 = keyValueStore1.getKey(`${ResourceEnum.RB}-abc1234`);
    const key3 = keyValueStore1.getKey(getKey(ResourceEnum.RA, { a: 1, b: 2, c: 3 }));
    const key4 = keyValueStore2.getKey(ResourceEnum.RA);
    const key5 = keyValueStore2.getKey(`${ResourceEnum.RB}-abc1234`);
    const key6 = keyValueStore2.getKey(getKey(ResourceEnum.RA, { a: 1, b: 2, c: 3 }));

    // prettier-ignore
    console.log(`-------- before delete all --------`);

    await keyValueStore1.set(key1, { customer: "customer1", product: "product1" });
    console.log(`key1:`, `'${key1}'`, `result from key1:`, await keyValueStore1.get(key1));

    await keyValueStore1.set(key2, { customer: "customer2", product: "product2" });
    console.log(`key2:`, `'${key2}'`, `result from key2:`, await keyValueStore1.get(key2));

    await keyValueStore1.set(key3, { customer: "customer3", product: "product3" });
    console.log(`key3:`, `'${key3}'`, `result from key3:`, await keyValueStore1.get(key3));

    await keyValueStore2.set(key4, { customer: "customer4", product: "product4" });
    console.log(`key4:`, `'${key4}'`, `result from key4:`, await keyValueStore2.get(key4));

    await keyValueStore2.set(key5, { customer: "customer5", product: "product5" });
    console.log(`key5:`, `'${key5}'`, `result from key5:`, await keyValueStore2.get(key5));

    await keyValueStore2.set(key6, { customer: "customer6", product: "product6" });
    console.log(`key6:`, `'${key6}'`, `result from key6:`, await keyValueStore2.get(key6));

    console.log(`-------- deleting --------`);

    // await keyValueStore.delete(key1);
    // await keyValueStore.delete(key2);
    // await keyValueStore.delete(key3);
    await keyValueStore1.deleteWhere(keyValueStore1.getKey("*"));

    console.log(`-------- after delete all --------`);

    console.log(`key1:`, `'${key1}'`, `result from key1:`, await keyValueStore1.get(key1));
    console.log(`key2:`, `'${key2}'`, `result from key2:`, await keyValueStore1.get(key2));
    console.log(`key3:`, `'${key3}'`, `result from key3:`, await keyValueStore1.get(key3));
    console.log(`key4:`, `'${key4}'`, `result from key4:`, await keyValueStore2.get(key4));
    console.log(`key5:`, `'${key5}'`, `result from key5:`, await keyValueStore2.get(key5));
    console.log(`key6:`, `'${key6}'`, `result from key6:`, await keyValueStore2.get(key6));

    process.exit(0);
};

main();
