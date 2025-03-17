
import { AppError } from "../../utilities/AppError.js";
import { catchError } from "../../utilities/catchError.js";
import env from "dotenv"
env.config()


// const bodyParser = require("body-parser");
// app.use(bodyParser.json());

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;

let authToken = "";



//& Get Single User :
export const paymentVodafoneCash = catchError(
   async(req , res , next)=>{

      res.json({message:"success"})
   }
)


//& 1. الحصول على التوكن من PayMob :
export const getAuthToken = catchError(
   async(req , res , next)=>{
      const response = await axios.post("https://accept.paymob.com/api/auth/tokens", {
         api_key: PAYMOB_API_KEY,
      });
      authToken = response.data.token;

      res.json({message:"success"})
   }
)



//& 1. الحصول على التوكن من PayMob :
export const create_payment = catchError(
   async(req , res , next)=>{
      await getAuthToken();

      const { amount, phone } = req.body;

      // تحويل المبلغ إلى قروش (100 جنيه = 10000 قرش)
      const orderResponse = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
         auth_token: authToken,
         delivery_needed: "false",
         amount_cents: amount * 100,
         currency: "EGP",
         merchant_order_id: new Date().getTime(),
         items: [],
      });

      const orderId = orderResponse.data.id;

      // طلب Payment Key
      const paymentKeyResponse = await axios.post("https://accept.paymob.com/api/acceptance/payment_keys", {
         auth_token: authToken,
         amount_cents: amount * 100,
         expiration: 3600,
         order_id: orderId,
         billing_data: {
            phone_number: phone,
            first_name: "Test",
            last_name: "User",
            email: "test@example.com",
            country: "EG",
            city: "Cairo",
            state: "Cairo",
            street: "123 Street",
            building: "1",
            apartment: "1",
            floor: "1",
         },
         currency: "EGP",
         integration_id: PAYMOB_INTEGRATION_ID,
      });

      const paymentKey = paymentKeyResponse.data.token;

      res.json({
         redirect_url: `https://accept.paymob.com/api/acceptance/iframes/YOUR_IFRAME_ID?payment_token=${paymentKey}`,
      });
   }
)






export const create_online_order = catchError(
   async(req , res , next)=>{
      console.log("Done Webhook");
      

   const paymentData = req.body;  // البيانات اللي جاية من PayMob
   console.log("Payment Callback Received:", paymentData);

   if (paymentData.success) {
      console.log(`💰 Successfully Payment: ${paymentData.amount_cents / 100} EGP`);
   } else {
      console.log(`❌ Failed Payment Ya Mahmoud`);
   }
      res.json({message:"Successfully"}) ; 
}
)
