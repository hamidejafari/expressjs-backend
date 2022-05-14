const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
    try {
        let user;
        let token;

        user = await User.findOne({email:req.body.email});

        if(!user){
            res.status(200).json({status:'error',message:'youre not registered go signup'});
        }


        const bcryptResult = await bcrypt.compare(req.body.password, user.password);
        if(bcryptResult){
            token = user.generateToken();
        }else{
            res.status(200).json({status:'error',message:'password is not correct'});
        }

        res.status(200).json({status:'success',token:token});

    } catch (err) {
        // throw(err);
        next(err)
    }
};

module.exports = login;