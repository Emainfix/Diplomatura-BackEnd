const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('fastest-validator');
const { where } = require('sequelize');

function signUp(req, res){


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

                    const schema = { // validamos lo que se ingrese
                            name: {type:"string", optional: false, max: "100", min: "2"},
                            email: {type: "string", optional: false, max: "500", min:"5"},
                            password: {type: "string", optional: false,max: "500", min:"5"}
                        }
                    
                        const v = new Validator();
                        const validationResponse = v.validate(user, schema);
                        
                        if(validationResponse !== true){
                            return res.status(400).json({
                                message: "Fallo de la validacion",
                                errors: validationResponse
                            });
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
                    }, process.env.JWT_KEY, function(err, token){
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

async function userUpdate(req, res) {
    const id = req.params.id; 

    try {
    
        let newPassword;

        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10);
            newPassword = await bcryptjs.hash(req.body.password, salt);
        }

        const updatedUser = {
            name: req.body.name,
            email: req.body.email,
            ...(req.body.password && { password: newPassword }) 
        };

        const result = await models.User.update(updatedUser, {
            where: { id: id }
        });

        if (result[0] === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            message: "Usuario actualizado correctamente",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            message: "No se pudo actualizar el usuario",
            error: error
        });
    }
}

function userDelete(req, res){
    const id = req.params.id;
    const userId = 1;

    models.User.destroy({where:{id:id}}).then(result => {
        res.status(200).json({
            message: "El usuario se eliminó correctamente"
        });
    }).catch(error =>{
        res.status(400).json({
            message: "No se pudo eliminar el usuario",
            error:error
        });
    });
}

module.exports = {
    signUp: signUp,
    login: login,
    userUpdate: userUpdate,
    userDelete: userDelete
}