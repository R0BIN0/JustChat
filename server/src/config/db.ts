import mongoose from "mongoose";

export const connectedDB = () => {
  mongoose
    .connect(process.env.LOCAL_DB_URL ?? "")
    .then((con) => console.log(`MongoDB connected with SUCCESS on host : ${con.connection.host}`));
};
