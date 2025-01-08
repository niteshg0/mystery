import mongoose from "mongoose";



type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to Database");
    return;
  }

  try {
    // const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    const db = await mongoose.connect("mongodb+srv://nitesh:Fxb0EbGR5lQTrjhS@mystery.xedow.mongodb.net/?retryWrites=true&w=majority&appName=mystery");

    // console.log(db);

    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected successfully");
  } catch (error) {
    console.log("DB Connection failed", error);

    process.exit(1);
  }
}

export default dbConnect;
