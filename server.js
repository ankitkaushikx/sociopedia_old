import dotenv from "dotenv/config";
import express from "express";
import bodyParser from "body-parser";

import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path"; //native package
import { fileURLToPath } from "url";
import connectDB from "./db.js";
/* CONFIGURATIONS   */
/* Set __filename to absolute path of current module   [D:\mainProjects\Learning\sociopedia\server\server.js] */
const __filename = fileURLToPath(import.meta.url);

/* set __dirname to directory path of current module [D:\mainProjects\Learning\sociopedia\server]  */
const __dirname = path.dirname(__filename);

/* Creating a Express App */
const app = express();

/* Enable app to parse (read) json data in body request */
app.use(express.json());
/* Middleware to add Headers to our HTTP request -- make our app secure */
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); ///Let App can accept cross origin request i.e. request origin can be different form resource origin ///
app.use(morgan); //To Log HTTP request Data
app.use(bodyParser.json({ limit: "30mb", extended: true })); //Let parse HTTP request before handlers and if json payload is more then 30m then reject it and extended: true will let accept  rich objects
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); //parse  url encoded data
app.use(cors()); //cross origin resource policy
/*  sets up a route /assests to serve static files from the public/assests directory in the Express app. */
app.use("/assests", express.static(path.join(__dirname, "public/assests")));

/*---------------------------------FILE STORAGE--------------------------------------------------------------------------------------------*/
/* It defines the destination folder for storing uploaded files as "public/assests"
 and maintains the original file names during storage. */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assests");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/*------------------------------------------------DATABASE AND SERVER ---------------------------------------------*/
const PORT = process.env.PORT || 5000;
await connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("--------SERVER STARTED SUCCESSFULLY AT", PORT);
    });
  })
  .catch((error) => {
    console.error("DATABASE OR SERVER ERROR\n", error);
  });
