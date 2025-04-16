class ApiError extends Error {
    /**
     * @param {number} statusCode
     * @param {string} message
     * @param {any[]} errors 
     * @param {string} stack
    */
    
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.success = false
        this.errors = errors
        if (stack) { // If a stack trace is already provided when creating the ApiError instance, it uses that stack trace.
            this.stack = stack
        } else { // here automatically it captures the current stack trace
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// https://nodejs.org/api/errors.html#errorcapturestacktracetargetobject-constructoropt
// https://nodejs.org/api/errors.html#errorstack

export { ApiError }


/*
    * Error.captureStackTrace(targetObject, constructorOpt) is a Node.js-specific method that customizes how errors are logged.
        targetObject → The object (usually an Error instance) where the stack trace will be attached.
        constructorOpt (optional) → A function to exclude from the stack trace (e.g., an error class constructor).

        If we don't use 'constructorOpt' By default, when an error occurs, the entire call stack (including the constructor function) is logged.
        If we use 'constructorOpt' it removes the specified constructor from the stack trace, making it cleaner and more readable.


    * 'this' in Error.captureStackTrace(this, this.constructor); refers to the instance of the ApiError class.
        this → Refers to the current instance of ApiError.
        this.constructor → Refers to the class constructor (ApiError)

    ! =============================================================================

    * What is JSDoc?
        JSDoc is a documentation syntax used for describing JavaScript functions, classes, and parameters.
    @param is used to describe function parameters.
    The curly brackets {} define the expected data type.
    The parameter name (e.g., statusCode, message) follows the type.     

    When using JSDoc, some editors (like VS Code) will show autocompletion and type hints based on these comments. 

*/