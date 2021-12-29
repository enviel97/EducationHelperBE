import dotenv from "dotenv";
dotenv.config();

export const apiKey = process.env.API_KEY as string;
export const connection_string = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@educationhelper.jnqvh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
export const private_key = process.env.PRIVATE_KEY as string;

export const firebaseConfig = {
  type: process.env.type as string,
  project_id: process.env.project_id as string,
  private_key_id: process.env.f_private_key_id as string,
  private_key: process.env.f_private_key as string,
  client_email: process.env.client_email as string,
  client_id: process.env.client_id as string,
  auth_uri: process.env.auth_uri as string,
  token_uri: process.env.token_uri as string,
  auth_provider_x509_cert_url: process.env
    .auth_provider_x509_cert_url as string,
  client_x509_cert_url: process.env.client_x509_cert_url as string,
};
export const storageBucket = process.env.storageBucket as string;

export const redisConfig = {
  host: process.env.token_host as string,
  port: parseInt(process.env.token_port as string),
  password: process.env.token_password as string,
};
