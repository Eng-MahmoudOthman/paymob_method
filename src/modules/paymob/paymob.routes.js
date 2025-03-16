import { Router } from "express";

// import { validation } from "../../middleWare/validation.js";

// import { protectedRoutes } from "../../middleWare/authentication.js";
// import { authorize } from "../../middleWare/authorization.js";
// import { ROLES } from "../../utilities/enums.js";
import { create_payment, paymentVodafoneCash } from "./paymob.controller.js";




const router  = Router() ; 
   router.route("/")
      .get(paymentVodafoneCash)


   // 2. إنشاء طلب دفع
   router.route("/create-payment")
      .post(create_payment)

export default router ;


