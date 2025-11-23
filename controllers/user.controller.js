const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');

function signUp(req, res){

    const schema = { // validamos lo que se ingrese
            title: {type:"string", optional: false, max: "100"},
            content: {type: "string", optional: false, max: "500"},
            categoryId: {type: "number", optional: false}
        }
    
        const v = new Validator();
        const validationResponse = v.validate(post, schema);

    models.User.findOne({where:{email:req.body.email}}).then(result =>{
        if(result){
            res.status(409).json({
                message: "El Email ya está en uso",
            });
        }else{
            bcryptjs.genSalt(10, function(err, salt){
                bcryptjs.hash(req.body.password, salt, function(err, hash){
                    const user = {
                        name:req.body.name,
                        email:req.body.email,
                        password: hash
                    }

                    models.User.create(user).then(result =>{
                        res.status(201).json({
                            message: "Usuario creado",
                        });
                    }).catch(error =>{
                        res.status(500).json({
                            message: "Algo salió mal",
                        });
                    });
                });
            });
        }
    }).catch(error =>{
        res.status(500).json({
            message: "Algo salió mal",
        });
    });

}

function login(req, res){
    models.User.findOne({where:{email: req.body.email}}).then(user => {
        if(user === null){
            res.status(401).json({
                message: "Credenciales invalidas",
            });
        }else{
            bcryptjs.compare(req.body.password, user.password, function(err, result){
                if(result){
                    const token = jwt.sign({
                        email: user.email,
                        userId: user.id
                    }, 'secret', function(err, token){
                        res.status(200).json({
                            message: "Authentication succesful",
                            token: token
                        });
                    });
                }else{
                    res.status(401).json({
                        message: "Credenciales invalidas",
                    });
                }
            });
        }
    }).catch(error => {
        res.status(401).json({
            message: "Algo salió mal",
        });
    });
}

module.exports = {
    signUp: signUp,
    login: login
}