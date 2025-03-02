// export const catchAsyncError = (theFunction)=>{
//     return (req,res,next)=>{
//         Promise.resolve(theFunction(req,res,next)).catch(next);
//     }
// }


const catchAsyncError = (theFunction) => {
    return (req, res, next) => {
      Promise.resolve(theFunction(req, res, next)).catch(next);
    };
  };
  
  module.exports = catchAsyncError;
  