import { Router } from "express"
import { registerUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js"
import { userRegistrationValidator } from "../validators/index.js";

const router = Router()

router.route("/register").post(userRegistrationValidator(), validate, registerUser);
// userRegistrationValidator() force fully we executing this and it returns an array. jab /register me jaayenge tab yeh function immidiately run hojayega. for this is called factory pattern
// userRegistrationValidator() isme se jo bhi error aaya ya nhi aaya oh sidha validate ko pass hogi automatically so we not written in this 'next()', validate errors ko 'req' k body se le lega


export default router