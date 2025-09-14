import { CacheHandler, Fetch, RequestManager, Store } from '@warp-drive/core';
import {
  instantiateRecord,
  registerDerivations,
  SchemaService,
  teardownRecord,
} from '@warp-drive/core/reactive';
import { DefaultCachePolicy } from '@warp-drive/core/store';
import { JSONAPICache } from '@warp-drive/json-api';

export default class AppStore extends Store {
  requestManager = new RequestManager().use([Fetch]).useCache(CacheHandler);

  lifetimes = new DefaultCachePolicy({
    apiCacheHardExpires: 15 * 60 * 1000, // 15 minutes
    apiCacheSoftExpires: 1 * 30 * 1000, // 30 seconds
    constraints: {
      headers: {
        'X-WarpDrive-Expires': true,
        'Cache-Control': true,
        Expires: true,
      },
    },
  });

  createSchemaService() {
    const schema = new SchemaService();
    registerDerivations(schema);
    return schema;
  }

  createCache(capabilities) {
    return new JSONAPICache(capabilities);
  }

  instantiateRecord(key, createArgs) {
    return instantiateRecord(this, key, createArgs);
  }

  teardownRecord(record) {
    return teardownRecord(record);
  }
}
