import app from "./app.js";
import http from "node:http";
import { DBconnector } from "./DB.js";
import dotenv from "dotenv";
import "./routes/routes.js";

dotenv.config();

const PORT = process.env.PORT;
app.set('port', PORT);


const server = http.createServer(app);
DBconnector();
server.listen(PORT);

server.on('listening', () => {
    console.log(`Server is running on port ${PORT}`);
});
server.on('error', (error) => {
    console.error(`Error occurred: ${error.message}`);
    process.stderr.write(error.message);
    process.exit(1);
});