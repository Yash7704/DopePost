// const pwd = MdteX2GKQwWNGNJc;
// string = mongodb+srv://yashpandey30kp:MdteX2GKQwWNGNJc@cluster0.fpnvipc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
