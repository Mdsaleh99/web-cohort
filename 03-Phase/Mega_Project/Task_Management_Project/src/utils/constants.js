export const UserRolesEnum = {
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER: "member"
}

export const AvailableUserRoles = Object.values(UserRolesEnum)

export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done"
}

export const AvailableTaskStatuses = Object.values(TaskStatusEnum)

// Windows mei you can make a new file from terminal by using this command : New-Item filename.txt