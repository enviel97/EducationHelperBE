import dotenv from "dotenv";
dotenv.config();

export const apiKey = process.env.API_KEY as string;
export const connection_string = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@educationhelper.jnqvh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
export const private_key = process.env.PRIVATE_KEY as string;
