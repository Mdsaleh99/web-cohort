class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400 // jab statusCode < 400 hoga tabhi true hoga other wise false
    }
}

export { ApiResponse }