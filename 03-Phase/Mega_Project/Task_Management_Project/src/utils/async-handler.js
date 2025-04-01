// TODO: we may need later
// it is higher order function
function asyncHandler(requestHandler) {
    return function (req, res, next) {  // req, res, next ye automatically express lega ye jab hum controller router me pass karenge
        Promise.resolve(requestHandler(req, res, next))
                .catch(function(err){
                    next(err)
                })
    }
}

export { asyncHandler }
