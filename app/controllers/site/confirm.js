const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

const confirm = async (req, res, next) => {
    try {
        let user;
        let token;

        user = await User.findOne({email:req.body.email});
        const bcryptResult = await bcrypt.compare(req.body.code, user.confirmCode);
        if(bcryptResult){
            token = user.generateToken();
        }else{
            res.status(200).json({status:'error',message:'Code is not correct'});
        }

        res.status(200).json({status:'success',token:token});

    } catch (err) {
        // throw(err);
        next(err)
    }
};

module.exports = confirm;