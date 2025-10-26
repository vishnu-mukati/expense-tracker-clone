const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    const user = jwt.verify(token, 'sdiwjiei493ifgrek0efgjgef234jejgejgfjf90r943ijfgej349590egijffg9492r29jegjdjfgj9tj0934rjtffij');
    User.findByPk(user.userId).then((user)=>{  
        req.user = user;
        next();
    }
    ).catch((err)=>{
        res.status(401).json({message : 'Unauthorized'});
    });
};
module.exports = {
    authenticate
};