import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        if (mongoose.connection.readyState === 1) return;
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("🔗 Conectado a MongoDB");
    } catch (error) {
        console.error("❌ Error conectando a MongoDB", error);
        process.exit(1);
    }
};

export default connectDB;
