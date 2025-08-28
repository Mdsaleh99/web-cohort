/*
    * Modules:
        1. Built-in modules - (fs, http, path, etc.)
        2. User-defined or custom modules
        3. Third-party modules (External Modules)
*/

// require() function is used to load modules and it is part of the CommonJS module system in Node.js

// node.js wrapper function
/*
    require('module_name') - first search for 3rd party modules
    if not found, then search for built-in modules
    if not found, throw an error

    require('./math.js') - search in the current directory - (user-defined modules)

*/

const fs = require("node:fs") // here node because to avoid the conflicts if their is any third party pacakage named as fs


/*

    Named Export
    exports.<name> = value
    const { <name> } = require('./module_name)
    const value = require('./module_name)
    value.<name>

    
    Default Export
    There can be only 1 default export in one module
    default exports don't have any name

*/