import {createClient} from "redis";

const redisClient = createClient();


redisClient.on("connect", function () {
    console.log("Redis connected");
});

redisClient.on("error", function(error) {
    console.error(error);
});

export default redisClient;