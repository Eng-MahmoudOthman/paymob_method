// //! Handle Error External Express => Start the Code :
// process.on("uncaughtException" , (error)=>{
//   console.log("Error" , error);
// })



// import express from 'express'
// import cors from 'cors'
// import { dbConnection } from './DataBase/dbConnection.js';
// import env from "dotenv"
// import { initApp } from './src/initApp.js';

// env.config()

// const app = express()
// const port = process.env.PORT ||  5000 ;









// //& Express Middle Ware :
// app.use(cors());
// app.use(express.json()) ;


// initApp(app)
// dbConnection()

// // 3. استقبال Webhook عند نجاح الدفع
// app.post("/webhook", async (req, res) => {
//   console.log("Webhook received:", req.body);
//   res.sendStatus(200);
// });

// app.listen(port, () => console.log(`Server is running ....`))


// //! Handle Error dbConnection And External Express => End the Code :
// process.on("unhandledRejection" , (error)=>{
//   console.log("Error" , error);
// });
























//! Handle Error External Express => Start the Code :
process.on("uncaughtException" , (error)=>{
  console.log("Error" , error);
})



import express from 'express'
import cors from 'cors'
import env from "dotenv"
import axios from 'axios';
import { create_online_order } from './src/modules/paymob/paymob.controller.js';

env.config()

const app = express()
const port = process.env.PORT ||  5000 ;
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;

let authToken = "";








// //& Express Middle Ware :
// app.use(cors());
// app.use(express.json()) ;
// app.post("/webhook", create_online_order);
//& Express Middle Ware :
app.use(cors());
app.post("/webhook", express.raw({type:'application/json'}) , create_online_order);
app.use(express.json()) ;



// 3. استقبال Webhook عند نجاح الدفع







// 1. الحصول على التوكن من PayMob
const getAuthToken = async () => {
  try {
      const response = await axios.post("https://accept.paymob.com/api/auth/tokens", {
          api_key: PAYMOB_API_KEY,
      });
      authToken = response.data.token;
  } catch (error) {
      console.error("Error getting auth token:", error.response?.data || error.message);
  }
};

// 2. إنشاء طلب دفع
app.post("/create-payment", async (req, res) => {
  try {
      await getAuthToken();

      const { amount , phone } = req.body;

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

      const paymentKey = paymentKeyResponse.data.token ;
      res.json({
          redirect_url: `https://accept.paymob.com/api/acceptance/iframes/865137?payment_token=${paymentKey}`,
      });

  } catch (error) {
      console.error("Error creating payment:", error.response?.data || error.message);
      res.status(500).json({ error: "Payment creation failed" });
  }
});




app.get("/", async (req, res) => {
  try {
    console.log("Successfully Ya Mahmoud");
    res.json({message:"Successfully"})
  } catch (error) {
    res.json({message:"Failed"})
  }
});


const startServer = () => {
  try {
    const server = app.listen(port, () => console.log(`Server is running ....`))
  } catch (err) {
    console.log(err)
  }
}
startServer();




//! Handle Error dbConnection And External Express => End the Code :
process.on("unhandledRejection" , (error)=>{
  console.log("Error" , error);
});





// Mastercard:
// 5123456789012346
// Test Account Name
// 12/25
// 123



// 1528857