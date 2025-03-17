
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
      

   const {success , pending , amount_cents} = req.body.obj;  // البيانات اللي جاية من PayMob
      console.log("Success" , success);
      console.log("Pending" , pending);
      

   if (success) {
      console.log(`💰 Successfully Payment: ${amount_cents / 100} EGP`);
   } else {
      console.log(`❌ Failed Payment Ya Mahmoud`);
   }
}
)







// id=274849662&pending=false&amount_cents=150000&success=true&is_auth=false&is_capture=false&is_standalone_payment=true&is_voided=false&is_refunded=false&is_3d_secure=true&integration_id=4822951&profile_id=993047&has_parent_transaction=false&order=307781192&created_at=2025-03-17T12%3A54%3A36.718150&currency=EGP&merchant_commission=0&discount_details=%5B%5D&is_void=false&is_refund=false&error_occured=false&refunded_amount_cents=0&captured_amount=0&updated_at=2025-03-17T12%3A54%3A57.489850&is_settled=false&bill_balanced=false&is_bill=false&owner=1835600&merchant_order_id=1742208836457&data.message=Approved&source_data.type=card&source_data.pan=2346&source_data.sub_type=MasterCard&acq_response_code=00&txn_response_code=APPROVED&hmac=f2ae4dd58fb1cbc96da3c74467348df2f0d6e76553a2dfd795940abfba1553e53dbe6ac6c533d89abd525493bc55d76774e5fbbf8b9659cb35b6451161d50ff6