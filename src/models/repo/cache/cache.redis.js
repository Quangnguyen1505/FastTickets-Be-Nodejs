const { getIoRedis } = require('../../../dbs/init.redis');
const redisCache = getIoRedis().instanceConnect;

// ===== Key-Value Cache =====
const setValueCache = async (key, value) => {
    if (!redisCache) throw new Error('Redis connect error');
    try {
        return await redisCache.set(key, value);
    } catch (error) {
        throw new Error('Set value in cache error: ' + error.message);
    }
};

const setValueCacheExpire = async (key, value, time) => {
    if (!redisCache) throw new Error('Redis connect error');
    try {
        return await redisCache.set(key, value, 'EX', time);
    } catch (error) {
        throw new Error('Set value expire in cache error: ' + error.message);
    }
};

const getValueCache = async (key) => {
    if (!redisCache) throw new Error('Redis connect error');
    try {
        return await redisCache.get(key);
    } catch (error) {
        throw new Error('Get value in cache error: ' + error.message);
    }
};

// ===== Hash Cache =====
const setHashValue = async (hashKey, ...fieldValues) => {
    if (!redisCache) throw new Error('Redis connect error');
    try {
        const args = Array.isArray(fieldValues[0]) ? fieldValues[0] : fieldValues;
        return await redisCache.hset(hashKey, ...args);
    } catch (error) {
        throw new Error('Set hash value error: ' + error.message);
    }
};

const getHashValue = async (hashKey, field) => {
    if (!redisCache) throw new Error('Redis connect error');
    try {
        return await redisCache.hget(hashKey, field);
    } catch (error) {
        throw new Error('Get hash value error: ' + error.message);
    }
};

const deleteHashField = async (hashKey, field) => {
    if (!redisCache) throw new Error('Redis connect error');
    try {
        return await redisCache.hdel(hashKey, field);
    } catch (error) {
        throw new Error('Delete hash field error: ' + error.message);
    }
};

const existsHashField = async (hashKey, field) => {
    if (!redisCache) throw new Error('Redis connect error');
    try {
        return await redisCache.hexists(hashKey, field);
    } catch (error) {
        throw new Error('Check hash field existence error: ' + error.message);
    }
};

const getAllHashValues = async (hashKey) => {
    if (!redisCache) throw new Error('Redis connect error');
    try {
        return await redisCache.hgetall(hashKey);
    } catch (error) {
        throw new Error('Get all hash values error: ' + error.message);
    }
};

const getAllHashKeys = async (hashKey) => {
    if (!redisCache) throw new Error('Redis connect error');
    try {
        return await redisCache.hkeys(hashKey);
    } catch (error) {
        throw new Error('Get hash keys error: ' + error.message);
    }
};

const getAllHashVals = async (hashKey) => {
    if (!redisCache) throw new Error('Redis connect error');
    try {
        return await redisCache.hvals(hashKey);
    } catch (error) {
        throw new Error('Get hash values error: ' + error.message);
    }
};

// ===== Export =====
module.exports = {
    setValueCache,
    setValueCacheExpire,
    getValueCache,
    setHashValue,
    getHashValue,
    deleteHashField,
    existsHashField,
    getAllHashValues,
    getAllHashKeys,
    getAllHashVals
};
