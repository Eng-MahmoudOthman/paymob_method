import { Router } from "express";
import { create_payment , getSuccess  } from "./paymob.controller.js";




const router  = Router() ; 
   router.route("/")
      .get(getSuccess)


   // 2. إنشاء طلب دفع
   router.route("/create-payment")
      .post(create_payment)
      
export default router ;


