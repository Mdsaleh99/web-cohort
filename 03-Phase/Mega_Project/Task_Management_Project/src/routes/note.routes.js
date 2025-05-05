import { Router } from "express"
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/note.controllers.js"
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js"
import { validateProjectPermission } from "../middlewares/auth.middleware.js"

const router = Router()

router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRoles), getNotes) // AvailableUserRoles it is a array so we passed directly
    .post(validateProjectPermission([UserRolesEnum.ADMIN]), createNote);

router.route("/:projectId/n/:noteId")
    .get(validateProjectPermission(AvailableUserRoles), getNoteById)
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateNote)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteNote)

export default router