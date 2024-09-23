import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { connectDatabase } from "./config/database";
import { routesAdmin } from "./routes/admin";
connectDatabase();
import { routesClient } from "./routes/client/index.route";
import { systemConfig } from "./config/system";
import path from "path";
const app: Express = express();
const port: number | string = process.env.PORT || 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.locals.prefixAdmin = systemConfig.prefixAdmin;
// dùng biến prefixAdmin cho file pug

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
routesAdmin(app);
routesClient(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})