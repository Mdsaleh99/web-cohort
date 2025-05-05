import { validationResult } from "express-validator"
import {ApiError} from "../utils/api-error.js"

export const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next()
    }
    const extractError = []
    errors.array().map((err) => extractError.push({
        field: err.path,
        message: err.msg
    }))
    console.log(extractError);
    
    throw new ApiError(422, "Recieved data is not valid", extractError)
}