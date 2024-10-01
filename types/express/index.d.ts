import 'express-serve-static-core'; // import để đảm bảo có sẵn types cho express  

declare module 'express-serve-static-core' {  
    interface Request {  
        flash: (type: string, message?: string) => string | any[];  
    }  
}