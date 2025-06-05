import mongoose from "mongoose";

const DatabaseConnection = async () => {
    try {
        const databaseCluster = process.env.MONGO_DB
        await mongoose.connect(databaseCluster);
        console.log(`✅ Successfully connected to the database.`);
    } catch (error) {
        console.log("❌ MongoDB Connection Error:", error);
        process.exit(1)
    }
}

export { DatabaseConnection }