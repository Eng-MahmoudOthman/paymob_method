
import { Router } from "express" ;
import paymobRouter from "../modules/paymob/paymob.routes.js" ;




const router = Router() ;
   router.use("/paymob" , paymobRouter) ;
export default router ;
