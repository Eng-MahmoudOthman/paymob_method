import { userModel } from "../../DataBase/models/user.model.js";
import { AppError } from "../utilities/AppError.js";
import { catchError } from "../utilities/catchError.js";
import { customAlphabet } from 'nanoid' ;


const nanoid = customAlphabet('0123456789', 6) ;
const timeouts = {}; // كائن لتخزين التايمرات النشطة لكل موظف



   export const generateOTPCode = catchError(
      async (req , res , next)=>{
         const{id , employee_code} = req.body ; 

         const otp_code = nanoid() ;
         const userExist = await userModel.findOne({
            $or: [
               { _id: id },
               { employee_code }
            ]
         });
         
         if(!userExist)  return next(new AppError("User Not Registration" , 404)) ;

         //! Checked If there is an old timer for this employee, delete it.
         if (timeouts[userExist.employee_code]) {
            console.log(`Clearing old timeout for ${userExist.employee_code}`);
            clearTimeout(timeouts[userExist.employee_code]);
         }

         //! Create a new timer to delete after 10 minutes :
         timeouts[userExist.employee_code] = setTimeout(async () => {
            console.log(`Executing timeout for ${userExist.employee_code}`);
            const updated = await userModel.findByIdAndUpdate( userExist._id , { otp_code: null } , {new:true});

            //! Remove the timer from the object :
            delete timeouts[userExist.employee_code];
         }, 10 * 60 * 1000) ; 


         await userModel.findByIdAndUpdate(userExist._id , {otp_code} , {new :true}) ;
         console.log(`OTP generated for ${userExist.employee_code}: ${otp_code}`);


         req.otp_code = otp_code
         req.userExist = userExist
         next()
      }
   )