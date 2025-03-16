import { globalError } from "./utilities/globalError.js";
import v1_Router from "./routes/v1.routes.js"




import env from "dotenv"
import { AppError } from "./utilities/AppError.js";

env.config()


export const initApp = (app)=>{


   //^ User Routing :
   app.use("/api/v1" , v1_Router) ;



   //^ Express Middle Ware
   app.get('/*', (req , res , next) =>{ 
      return next(new AppError("Not_Found_Page" , 404))
   });
   



   //^ global Error Handling Middle Ware :
   app.use(globalError) ;
}

