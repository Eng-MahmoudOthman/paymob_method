
import coreJoi from "joi"; 
import JoiDate from '@joi/date'; 
const Joi = coreJoi.extend(JoiDate);



//^ General File Validation : 
	const file = Joi.object({
		size:Joi.number().positive(),
		path:Joi.string(),
		filename:Joi.string(),
		destination:Joi.string(),
		mimetype:Joi.string(),
		encoding:Joi.string(),
		originalname:Joi.string(),
		fieldname:Joi.string(),
		finalDest:Joi.string()
	})
	
//^ General Headers Validation : 
	const headers = Joi.object({
		token: Joi.string() ,
		// token: Joi.string().min(200).max(250).required(),
		"content-type" : Joi.string() ,
		"user-agent" : Joi.string() ,
		accept : Joi.string() ,
		"postman-token" : Joi.string() ,
		host : Joi.string(),
		"accept-encoding" : Joi.string() ,
		connection : Joi.string() ,
		"content-length" : Joi.string() ,
	})  








export const paramsIdVal = Joi.object({
   id:Joi.string().hex().length(24).required() ,

	// headers : headers
})


export const updateUserRoleVal = Joi.object({
	id:Joi.string().hex().length(24).required() ,

	role:Joi.string().valid("user" , "admin" , "moderator") ,
	branch: Joi.string().hex().length(24) ,

	// headers : headers
})

export const updateProfileImageVal = Joi.object({
	file:file.required() ,
})



export const updateUserVal = Joi.object({
	name:Joi.string().min(2).max(50).trim() ,
	phone:Joi.string().pattern(/^(002)?01[0125][0-9]{8}$/) ,
	email:Joi.string().email().trim() ,
})



