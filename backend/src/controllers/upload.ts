import multer from "multer";
import * as path from 'path';
import { config } from '../config';
import express from "express";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const destinationPath = path.join(__dirname, '..', '..', config.UPLOADS_DIR);
        cb(null, destinationPath);
        
    },
    filename:(req,file,cb)=>{
        const fileName=Date.now()+'-'+file.originalname;
        cb(null,fileName);
    }
})

export const serveUploads=()=>{
    return express.static(path.join(__dirname, '..', '..',config.DATABASE_URL)) 
}

export const upload = multer({ storage: storage });

