import { Router } from "express";
import { forgotPasswordRequest, registerUser, verifyEmail } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { userRegisterValidator } from "../validators/index.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router
    .route("/register")
    .post(
        upload.fields([{ name: "avatar", maxCount: 1 }]),
        userRegisterValidator(),
        validate,
        registerUser,
    );
// userRegistrationValidator() force fully we executing this and it returns an array. jab /register me jaayenge tab yeh function immidiately run hojayega. for this is called factory pattern
// userRegistrationValidator() isme se jo bhi error aaya ya nhi aaya oh sidha validate ko pass hogi automatically so we not written in this 'next()', validate errors ko 'req' k body se le lega

router.route("/verify-email/:token").post(verifyEmail);
router.route("/reset-password/:id/:token").post(forgotPasswordRequest);

export default router;

/*

upload.single("avatar") -----> Accepts only one file. File will be stored at: req.file (not req.files). Best for single file input only.


upload.fields([{ name: "avatar", maxCount: 1 }]) -----> Accepts multiple files from multiple fields (each with its own name). Files are stored at: req.files['avatar'].
Best when you expect multiple file inputs like:
    avatar
    coverImage
    document

*/
