import env from "dotenv"
import axios from 'axios';
import { catchError } from "../../utilities/catchError.js";
env.config()



const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
let authToken = "";



//& Create Token In Paymob :
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



//& Create Payment Method :
   export const create_payment = async (req , res , next) => {
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
   };


//& Receive Webhook From Paymob :
   export const webhook = catchError(
      async(req , res , next)=>{
      const {success , pending , amount_cents , data , order} = req.body.obj ;  // البيانات اللي جاية من PayMob
         console.log("Done Webhook");
         console.log("Success" , success);
         console.log("Pending" , pending);
         console.log("order_url" , order.order_url);
         console.log(req.body.obj);
         
      if (success) {
         console.log(`💰 Successfully Payment Message : ${data.message} ${amount_cents / 100} EGP`);
      } else {
         console.log(`❌ Failed Payment Message : ${data.message}`);
      }
   }
   )



//& End Point To Testing :
   export const getSuccess = catchError(
      async(req , res , next)=>{
         console.log("Successfully Ya Mahmoud Othman");
         res.json({message:"Successfully Ya Mahmoud Othman"})
      }
   )








































// Shape Response From Paymob :

let x = {
   id: 274858027,
   pending: false,
   amount_cents: 150000,
   success: true,
   is_auth: false,
   is_capture: false,
   is_standalone_payment: true,
   is_voided: false,
   is_refunded: false,
   is_3d_secure: true,
   integration_id: 4822951,
   profile_id: 993047,
   has_parent_transaction: false,
   order: {
     id: 307790401,
     created_at: '2025-03-17T13:29:57.396051',
     delivery_needed: false,
     merchant: {
       id: 993047,
       created_at: '2024-08-30T09:26:42.651313',
       phones: [Array],
       company_emails: [Array],
       company_name: 'Medical Services',
       state: '',
       country: 'EGY',
       city: 'Cairo',
       postal_code: '',
       street: ''
     },
     collector: null,
     amount_cents: 150000,
     shipping_data: {
       id: 151948572,
       first_name: 'Test',
       last_name: 'User',
       street: '123 Street',
       building: '1',
       floor: '1',
       apartment: '1',
       city: 'Cairo',
       state: 'Cairo',
       country: 'EG',
       email: 'test@example.com',
       phone_number: '01126999142',
       postal_code: 'NA',
       extra_description: '',
       shipping_method: 'UNK',
       order_id: 307790401,
       order: 307790401
     },
     currency: 'EGP',
     is_payment_locked: false,
     is_return: false,
     is_cancel: false,
     is_returned: false,
     is_canceled: false,
     merchant_order_id: '1742210997346',
     wallet_notification: null,
     paid_amount_cents: 150000,
     notify_user_with_email: false,
     items: [],
     order_url: 'https://accept.paymob.com/standalone/?ref=i_LRR2Z1FnVmVBZ25QMjhSRW1CeloraUppdz09X2RSV2ovZ2x5amN2aFZFYzVDVUN5SFE9PQ',
     commission_fees: 0,
     delivery_fees_cents: 0,
     delivery_vat_cents: 0,
     payment_method: 'tbc',
     merchant_staff_tag: null,
     api_source: 'OTHER',
     data: {},
     payment_status: 'PAID'
   },
   created_at: '2025-03-17T13:30:39.957393',
   transaction_processed_callback_responses: [],
   currency: 'EGP',
   source_data: { pan: '2346', type: 'card', tenure: null, sub_type: 'MasterCard' },
   api_source: 'IFRAME',
   terminal_id: null,
   merchant_commission: 0,
   installment: null,
   discount_details: [],
   is_void: false,
   is_refund: false,
   data: {
     gateway_integration_pk: 4822951,
     klass: 'MigsPayment',
     created_at: '2025-03-17T11:30:59.738205',
     amount: 150000,
     currency: 'EGP',
     migs_order: {
       acceptPartialAmount: false,
       amount: 1500,
       authenticationStatus: 'AUTHENTICATION_SUCCESSFUL',
       chargeback: [Object],
       creationTime: '2025-03-17T11:30:54.975Z',
       currency: 'EGP',
       description: 'PAYMOB Medical Services',
       id: '307790401',
       lastUpdatedTime: '2025-03-17T11:30:59.463Z',
       merchantAmount: 1500,
       merchantCategoryCode: '7299',
       merchantCurrency: 'EGP',
       status: 'CAPTURED',
       totalAuthorizedAmount: 1500,
       totalCapturedAmount: 1500,
       totalRefundedAmount: 0
     },
     merchant: 'TESTMERCH_C_25P',
     migs_result: 'SUCCESS',
     migs_transaction: {
       acquirer: [Object],
       amount: 1500,
       authenticationStatus: 'AUTHENTICATION_SUCCESSFUL',
       authorizationCode: '179702',
       currency: 'EGP',
       id: '274858027',
       receipt: '507611179702',
       source: 'INTERNET',
       stan: '179702',
       terminal: 'BMNF0506',
       type: 'PAYMENT'
     },
     txn_response_code: 'APPROVED',
     acq_response_code: '00',
     message: 'Approved',
     merchant_txn_ref: '274858027',
     order_info: '307790401',
     receipt_no: '507611179702',
     transaction_no: '123456789',
     batch_no: 20250317,
     authorize_id: '179702',
     card_type: 'MASTERCARD',
     card_num: '512345xxxxxx2346',
     secure_hash: '',
     avs_result_code: '',
     avs_acq_response_code: '00',
     captured_amount: 1500,
     authorised_amount: 1500,
     refunded_amount: 0,
     acs_eci: '02'
   },
   is_hidden: false,
   payment_key_claims: {
     exp: 1742214597,
     extra: {},
     pmk_ip: '54.196.140.205',
     user_id: 1835600,
     currency: 'EGP',
     order_id: 307790401,
     amount_cents: 150000,
     billing_data: {
       city: 'Cairo',
       email: 'test@example.com',
       floor: '1',
       state: 'Cairo',
       street: '123 Street',
       country: 'EG',
       building: '1',
       apartment: '1',
       last_name: 'User',
       first_name: 'Test',
       postal_code: 'NA',
       phone_number: '01126999142',
       extra_description: 'NA'
     },
     integration_id: 4822951,
     lock_order_when_paid: false,
     single_payment_attempt: false
   },
   error_occured: false,
   is_live: false,
   other_endpoint_reference: null,
   refunded_amount_cents: 0,
   source_id: -1,
   is_captured: false,
   captured_amount: 0,
   merchant_staff_tag: null,
   updated_at: '2025-03-17T13:30:59.966306',
   is_settled: false,
   bill_balanced: false,
   is_bill: false,
   owner: 1835600,
   parent_transaction: null
}