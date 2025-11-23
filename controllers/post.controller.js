const Validator = require('fastest-validator');

const { where } = require('sequelize');
const models = require('../models');

function save(req, res){
    const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.image_url,
        categoryId: req.body.category_id,
        userId: 1
    }

    const schema = { // validamos lo que se ingrese
        title: {type:"string", optional: false, max: "100"},
        content: {type: "string", optional: false, max: "500"},
        categoryId: {type: "number", optional: false}
    }

    const v = new Validator();
    const validationResponse = v.validate(post, schema);
    
    if(validationResponse !== true){
        return res.status(400).json({
            message: "Fallo de la validacion",
            errors: validationResponse
        });
    }

    models.Post.create(post).then((result) => {
        res.status(201).json({
            message: "Publicación creada",
            post: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Algo salió mal",
            error: error
        });
    });
}

function show(req, res){
    const id = req.params.id;

    models.Post.findByPk(id).then(result =>{
    if(result){
        res.status(200).json(result);
    }else{
        res.status(404).json({
            message: "No se encontró el post"
        })
    }
    }).catch(error =>{
        res.status(500).json({
            message: "Algo salió mal"
        })
    });
}

function index(req, res){
    models.Post.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error =>{
        res.status(500).json({
            message: "Algo salió mal"
        })
    });
}

function update(req, res){
    const id = req.params.id;
    const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.image_url,
        categoryId: req.body.category_id,
    }

    const userId = 1;

    const schema = { // validamos lo que se ingrese
        title: {type:"string", optional: false, max: "100"},
        content: {type: "string", optional: false, max: "500"},
        categoryId: {type: "number", optional: false}
    }

    const v = new Validator();
    const validationResponse = v.validate(updatedPost, schema);
    
    if(validationResponse !== true){
        return res.status(400).json({
            message: "Fallo de la validacion",
            errors: validationResponse
        });
    }

    models.Post.update(updatedPost, {where: {id:id, userId}}).then(result => {
        res.status(200).json({
            message: "Se actualizó correctamente",
            post: updatedPost
        });
    }).catch(error => {
        res.status(400).json({
            message: "No se pudo actualizar",
            error:error
        });
    })
}

function destroy(req, res){
    const id = req.params.id;
    const userId = 1;

    models.Post.destroy({where:{id:id, userId:userId}}).then(result => {
        res.status(200).json({
            message: "Se borró correctamente"
        });
    }).catch(error =>{
        res.status(400).json({
            message: "No se pudo borrar",
            error:error
        });
    });

}

module.exports = {
    save: save,
    show: show,
    index: index,
    update: update,
    destroy: destroy
}