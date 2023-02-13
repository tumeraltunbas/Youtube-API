import CustomizedError from "../../helpers/error/CustomizedError.js";

export const errorHandler = (err, req, res, next) => {
    const error = new CustomizedError(err.status || 500, err.message);
    res.status(error.status).json({success:false, message:error.message});
}

export default errorHandler;