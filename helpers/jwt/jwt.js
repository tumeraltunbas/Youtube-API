export const sendJwtToCookie = (user, res) => {
    const {NODE_ENV, COOKIE_EXPIRES} = process.env;
    const token = user.createJwt();
    res.cookie("access_token", token, {httpOnly: NODE_ENV == "development" ? true : false, secure:false ,maxAge: COOKIE_EXPIRES})
    .status(200).json({success:true});
}