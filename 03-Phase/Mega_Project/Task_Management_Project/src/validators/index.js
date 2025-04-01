import { body } from "express-validator";

const userRegistrationValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is Required")
            .isEmail().withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("username is Required")
            .isLength({ min: 3 }).withMessage("username should be at least 3 character")
            .isLength({ max: 13 }).withMessage("username cannot exceed 13 character"),
        body("password")
            .trim()
            .notEmpty()
            .isLength({ min: 8 }).withMessage("password should be at least 3 character")
            .isLength({ max: 16 }).withMessage("password cannot exceed 13 character"),
        body("role")
            .trim()
            .notEmpty().withMessage("Role is Required")
    ];
};

const userLoginValidator = () => {
    return [
        body("email").isEmail().withMessage("Email is not valid"),
        body("password").notEmpty().withMessage("Password cannot be empty"),
    ];
};

export { userRegistrationValidator, userLoginValidator };
