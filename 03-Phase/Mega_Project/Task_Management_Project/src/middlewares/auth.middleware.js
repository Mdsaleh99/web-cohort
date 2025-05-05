import mongoose from "mongoose";
import { ProjectMember } from "../models/projectmember.models";
import User from "../models/user.models";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized token")
        }

        const user = await User.findById(decodedToken?._id).select(
            "-password",
            "-refreshToken",
            "-emailVerificationToken",
            "-emailVerificationExpiry",
            "-forgotPasswordExpiry",
            "-forgotPasswordToken",
        );

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user
        
        next()
    } catch (error) {
        console.error("Error While verify JWT");
        throw new ApiError(500, error?.message || "Error While verify JWT");
    }
})


export const validateProjectPermission = (roles = []) => asyncHandler(async (req, res, next) => {
    const { projectId } = req.params
    if (!projectId) {
        throw new ApiError(401, "Invalid project id")
    }

    // jo bhi user hai oh project member hona chahiye tabhi wo project ko access kar sakta hai
    // project bhi hona chahiye and user bhi hona chahiye because we bringing member of project and project me user hoga toh oh definetly kisi b role pe hoga admin ya member
    // this auth is for to get project members not project
    const projectMember = await ProjectMember.findOne({
        project: mongoose.Types.ObjectId(projectId), // we can directly give as projectId is a string when we are getting from params but sometimes gives error in mongoose so we are converting it to object id
        user: mongoose.Types.ObjectId(req.user._id)
    }) // ek project member ka details

    if (!projectMember) {
        throw new ApiError(404, "project not found");
    }

    // find what user role is given
    const giveRole = projectMember?.role
    req.user.role = giveRole
    
    if (!roles.includes(giveRole)) {
        throw new ApiError(403, "You do not have permission to perform this action")
    }

})
