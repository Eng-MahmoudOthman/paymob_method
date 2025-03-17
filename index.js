//! Handle Error External Express => Start the Code :
process.on("uncaughtException" , (error)=>{
   console.log("Error" , error);
})

import express from 'express'
import cors from 'cors'
import env from "dotenv"
import { create_payment  , getSuccess , webhookMiddleWre } from './src/modules/paymob/paymob.controller.js';


env.config()
const app = express()
const port = process.env.PORT ||  5000 ;








//& Express Middle Ware :
app.use(cors());
app.use(express.json()) ;



// & Create Payment Method :
app.post("/create-payment", create_payment);



//& Receive Webhook From Paymob :
app.post("/webhook", webhookMiddleWre);



//& End Point To Testing :
app.get("/", getSuccess );



//& Specific Function Vercel : 
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





// Mastercard Approved :
// 5123456789012346
// Test Account
// 12/25
// 123


// URL Server On Vercel :
// https://paymob-method.vercel.app/



// Postman Documentation :
// https://documenter.getpostman.com/view/29733612/2sAYkDLf9v