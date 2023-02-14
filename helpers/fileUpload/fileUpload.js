import root from "app-root-path";
import { randomInt } from "crypto";
import path from "path";
import CustomizedError from "../error/CustomizedError.js";

export const uploadFile = (req,next,type,id) => {
    if(!req.files)
    return res.status(400).send('You have to provide a file');
    const file = req.files.file;
    const fileName = String(id + '_' + String(randomInt(1111,9999))) + "." + file.mimetype.split("/")[1];
    const allowedMimetypes = ["image/png", "image/jpeg", "image/jpg"]
    if(!allowedMimetypes.includes(file.mimetype))
    return next(new CustomizedError(400, "Invalid file type, you can upload only jpeg, jpg and png files"));
    let uploadPath = path.join(root.path, "public", `${type}`, fileName);
    file.mv(uploadPath, function(err){
        if(err)
        return next(err);
    });
}