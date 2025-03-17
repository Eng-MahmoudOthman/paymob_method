
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
