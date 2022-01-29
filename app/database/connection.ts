import * as mongoose from "mongoose";

const mongoURI = (function (nodeEnv) {
    return process.env.MONGO_URI_DEV;
    switch (nodeEnv) {
        case "production":
            return process.env.MONGO_URI_PROD;
        case "test":
            return process.env.MONGO_URI_TEST;
        default:
            return process.env.MONGO_URI_DEV;
    }
})(process.env.NODE_ENV);

export const connect = () =>
    mongoose
        .connect(mongoURI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            poolSize: 40,
        })
        .catch((err) =>
            console.trace("error occurred when start to connect db" + err)
        );

export const disconnect = () =>
    mongoose.disconnect().then(() => {
        console.info(`MongoDB disconnected ${mongoURI}`);
    });

// @ts-ignore
let cached = global.mongoose;

if (!cached) {
    // @ts-ignore
    cached = global.mongoose = {conn: null, promise: null};
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = connect();
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
