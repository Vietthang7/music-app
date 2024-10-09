import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
// import flash from 'connect-flash';
import flashjs from 'express-flash';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import methodOverride from 'method-override';
import { connectDatabase } from "./config/database";
import { systemConfig } from "./config/system";
import path from "path";
connectDatabase();
const app: Express = express();
const port: number | string = process.env.PORT || 3000;
import { routesAdmin } from "./routes/admin/index.route";
import { routesClient } from "./routes/client/index.route";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('HHKALKS'));
app.use(session({
  secret: process.env.SESSION_SECRET, // Thay đổi secret này cho phù hợp  
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
// app.use(flash());
app.use(flashjs());
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.locals.prefixAdmin = systemConfig.prefixAdmin;
// Middlewares   
// app.use((req, res, next) => {
//   res.locals.messages = {
//     success: req.flash('success'),
//     error: req.flash('error')
//   };
//   next();
// });
// Static files for TinyMCE  
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Routes  
routesAdmin(app);
routesClient(app);
//404
app.get("*", (req: Request, res: Response) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found"
  });
});
// End 404
// Start server  
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

