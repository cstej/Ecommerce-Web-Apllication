import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

/** Connecting to DATABASE */
async function main() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(config.MONGODB_URL);
    console.log("DB CONNECTED");
  } catch (err) {
    throw err;
  }

  try {
    app.listen(config.PORT, () =>
      console.log(`SERVER IS RUNNING ON  ${config.PORT}`)
    );
  } catch {
    throw err;
  }
}
main();
