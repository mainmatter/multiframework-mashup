import { CacheHandler, Fetch, RequestManager, Store } from '@warp-drive/core';
import {
  instantiateRecord,
  registerDerivations,
  SchemaService,
  teardownRecord,
} from '@warp-drive/core/reactive';
import { DefaultCachePolicy } from '@warp-drive/core/store';
import { JSONAPICache } from '@warp-drive/json-api';

import { serializeResources } from '@ember-data/json-api/request';
const MUTATION_OPS = new Set(['createRecord', 'updateRecord']);

const UpdateHandler = {
  request(context, next) {
    if (!MUTATION_OPS.has(context.request.op)) {
      return next(context.request);
    }

    if (context.request.body) {
      return next(context.request);
    }

    const { data, store } = context.request;
    const newRequestParams = Object.assign({}, context.request, {
      body: JSON.stringify(serializeResources(store.cache, data.record)),
    });
    return next(newRequestParams);
  },
};

export default class AppStore extends Store {
  requestManager = new RequestManager()
    .use([UpdateHandler, Fetch])
    .useCache(CacheHandler);

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
