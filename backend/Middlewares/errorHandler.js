// class ErrorHandler extends Error{               // error class is a pre existing class in javascript
//     constructor(message,statusCode){
//         super(message);
//         this.statusCode = statusCode;
//     }
// }

// export const errorMiddleware=(err,req,res,next)=>{
//     err.message = err.message || "Internal server error";
//     err.statusCode = err.statusCode || 500;

//     // 11000 comes when same value occur 
//     if(err.code === 11000){                 
//         const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
//         err = new ErrorHandler(message,400);
//     }
//     if(err.name === "JSONWebTokenError"){
//         const message = "JSON Web Token is invalid, Try Again!";
//         err = new ErrorHandler(message,400);
//     }
//     if(err.name === "TokenExpiredError"){
//         const message = "Token is expired!";
//         err = new ErrorHandler(message,400);
//     }

//     //error occur when we dont enter data correctly (validation error or type not match..... )
//     if(err.name === "CastError"){
//         const message = `Invalid ${err.path}`;
//         err = new ErrorHandler(message,400);
//     }

//     const errorMessage = err.errors ? Object.values(err.errors).map(error=> error.message).join(" ") : err.message;

//     return res.status(err.statusCode).json({
//         success: false,
//         message: errorMessage,
//     });
// }

// export default ErrorHandler;



// Define ErrorHandler class
class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  // Define errorMiddleware
  const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;
  
    // Handle duplicate field error (e.g., MongoDB's duplicate key error)
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHandler(message, 400);
    }
  
    // Handle invalid JWT error
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web Token is invalid, Try Again!";
      err = new ErrorHandler(message, 400);
    }
  
    // Handle expired JWT error
    if (err.name === "TokenExpiredError") {
      const message = "Token has expired!";
      err = new ErrorHandler(message, 400);
    }
  
    // Handle Mongoose CastError (e.g., invalid ObjectId)
    if (err.name === "CastError") {
      const message = `Invalid ${err.path}`;
      err = new ErrorHandler(message, 400);
    }
  
    // Handle Mongoose validation errors
    const errorMessage = err.errors
      ? Object.values(err.errors).map((error) => error.message).join(" ")
      : err.message;
  
    return res.status(err.statusCode).json({
      success: false,
      message: errorMessage,
    });
  };
  
  module.exports = {
    ErrorHandler,
    errorMiddleware,
  };
  