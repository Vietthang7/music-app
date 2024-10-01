// import express, { Express } from "express";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// dotenv.config();
// // import flash from 'express-flash';
// import flash from 'connect-flash';
// import cookieParser from 'cookie-parser';
// import session from 'express-session';
// import methodOverride from 'method-override';
// import { connectDatabase } from "./config/database";
// import { routesAdmin } from "./routes/admin";
// connectDatabase();
// import { routesClient } from "./routes/client/index.route";
// import { systemConfig } from "./config/system";
// import path from "path";
// const app: Express = express();
// const port: number | string = process.env.PORT || 3000;
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// //Flash
// app.use(cookieParser('HHKALKS'));
// // app.use(session({ cookie: { maxAge: 60000 } }));
// app.use(session({  
//   secret: 'your-secret-key', // Thay đổi secret này cho phù hợp  
//   resave: false,  
//   saveUninitialized: true,  
//   cookie: { maxAge: 60000 }  
// }));
// app.use(flash());
// // app.use(flashsecond());
// //End Flash
// app.use(methodOverride('_method'));
// // parse application/json
// app.use(bodyParser.json());
// app.use(express.static(`${__dirname}/public`));
// app.set("views", `${__dirname}/views`);
// app.set("view engine", "pug");

// app.locals.prefixAdmin = systemConfig.prefixAdmin;
// // dùng biến prefixAdmin cho file pug
// // Middleware để truyền thông báo flash vào response.locals  
// app.use((req, res, next) => {  
//   res.locals.success = req.flash('success');  
//   res.locals.error = req.flash('error');  
//   next();  
// }); 
// app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// routesAdmin(app);
// routesClient(app);
// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// })
import express, { Express } from "express";  
import bodyParser from "body-parser";  
import dotenv from "dotenv";  
import flash from 'connect-flash';  
import cookieParser from 'cookie-parser';  
import session from 'express-session';  
import methodOverride from 'method-override';  
import { connectDatabase } from "./config/database";  
import { routesAdmin } from "./routes/admin";  
import { routesClient } from "./routes/client/index.route";  
import { systemConfig } from "./config/system";  
import path from "path";  

dotenv.config();  
const app: Express = express();  
const port: number | string = process.env.PORT || 3000;  

connectDatabase();  

// Middlewares  
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(cookieParser('HHKALKS'));  
app.use(session({  
    secret: 'your-secret-key', // Thay đổi secret này cho phù hợp  
    resave: false,  
    saveUninitialized: true,  
    cookie: { maxAge: 60000 }  
}));  
app.use(flash());  
app.use(methodOverride('_method'));  
app.use(bodyParser.json());  
app.use(express.static(`${__dirname}/public`));  
app.set("views", `${__dirname}/views`);  
app.set("view engine", "pug");  

app.locals.prefixAdmin = systemConfig.prefixAdmin;  
 
app.use((req, res, next) => {  
  res.locals.messages = {  
      success: req.flash('success'),  
      error: req.flash('error')  
  };  
  next();  
});
// Static files for TinyMCE  
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));  

// Routes  
routesAdmin(app);  
routesClient(app);  

// Start server  
app.listen(port, () => {  
  console.log(`App listening on port ${port}`);  
});