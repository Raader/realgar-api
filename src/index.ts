//configure environment variables
import dotenv from "dotenv";
dotenv.config();

import app from "./api";
//start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("app started at port: " + port));
