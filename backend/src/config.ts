import * as dotenv from 'dotenv';

dotenv.config();


interface Config{
    DATABASE_URL:string,
    JWT_SECRET:string,
    UPLOADS_DIR:string
}

export const config:Config = {
  DATABASE_URL: process.env.DATABASE_URL|| "",
    JWT_SECRET:process.env.JWT_SECRET || "",
    UPLOADS_DIR:process.env.UPLOADS_DIR|| ""
};
