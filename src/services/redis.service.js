const { promisify } = require('util');
const { getIoRedis } = require('../dbs/init.redis');
const { instanceConnect: redisClient } = getIoRedis();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);
const delAsyncKey = promisify(redisClient.del).bind(redisClient);

const acquireLock = async ({ seatId, showTimeId, expireTime = null }) => {
    console.log("Attempting to acquire lock, expireTime:", expireTime);

    const key = `lock_v2025_${seatId}_${showTimeId}`;
    console.log("Lock key:", key);
    
    // Kiểm tra nếu expireTime chưa được gửi, sử dụng giá trị mặc định
    if (!expireTime) {
        console.log("Expire time is missing, using default 5 minutes.");
        expireTime = Date.now() + 300000; // Nếu không có expireTime từ client, mặc định là 5 phút
    }

    for (let index = 0; index < 10; index++) { // Retry 10 times
        // Try to acquire lock
        const result = await setnxAsync(key, expireTime);
        console.log("Lock result:", result);

        if (result === 1) { // Lock acquired
            await pexpire(key, expireTime - Date.now()); // Tính thời gian còn lại từ thời điểm hiện tại
            console.log(`Lock acquired for ${seatId} with expiration at: ${expireTime} and time ${expireTime - Date.now()}`);
            return key;
        } else {
            console.log("Lock already held by someone else, retrying...");
            await new Promise((resolve) => setTimeout(resolve, 50)); // Retry after 50ms
        }
    }

    console.log("Failed to acquire lock after retries");
    return null;
};

const releaseLock = async (payload) => {
    const { seatId, showTimeId } = payload;
    const keyLock = `lock_v2025_${seatId}_${showTimeId}`;
    console.log("Releasing lock:", keyLock);
    await delAsyncKey(keyLock); // Delete the lock
    console.log("Lock released:", keyLock);
    return true;
};

module.exports = {
    acquireLock,
    releaseLock
};
