const express = require('express');
const videogame_mechanic = express.Router();
const axios = require('axios').default;
var bodyParser =require('body-parser');

var jsonParser = bodyParser.json()

const wrap = fn => (...args) => fn(...args).catch(args[2])
const sensorHost = "bgames-SensorManagementService:3007"

/* 
CRUD de videogames, mechanics y su relacion
*/

/*
RETRIEVE MODIFIABLE_MECHANIC:

1) Obtener UN modifiable_mechanic en particular 

2) Obtener UN videojuego en especial 

3) Obtener UNA la relacion videojuegos y mecanicas en particular dado id

4) Obtener UNA la relacion videojuegos y mecanicas en particular dado videogame y modifiable mechanic ids

5) Obtener TODOS los modifiable_mechanic 

6) Obtener TODOS los videojuegos 

7) Obtener TODAS las relaciones videojuegos y mecanicas

*/


//1) Obtener UN modifiable_mechanic en particular 
//WORKS
videogame_mechanic.get('/modifiable_mechanic/:id_modifiable_mechanic',jsonParser,  wrap(async(req,res,next)=>{
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic;

        var path ='/modifiable_mechanic/'+id_modifiable_mechanic.toString()      
    
    var url = "http://"+sensorHost + path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))
//2) Obtener UN videojuego en especial 
//WORKS
videogame_mechanic.get('/videogame/:id_videogame',jsonParser,  wrap(async(req,res,next)=>{
    var id_videogame = req.params.id_videogame;

        var path ='/videogame/'+id_videogame.toString()       
    
    var url = "http://"+sensorHost + path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))

//3) Obtener UNA la relacion videojuegos y mecanicas en particular dado id
//WORKS
videogame_mechanic.get('/modifiable_mechanic_videogame/:id_modifiable_mechanic_videogame',jsonParser,  wrap(async(req,res,next)=>{
    var id_modifiable_mechanic_videogame = req.params.id_modifiable_mechanic_videogame;

    var path ='/modifiable_mechanic_videogame/'+id_modifiable_mechanic_videogame.toString()       

    var url = "http://"+sensorHost + path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))

//4) Obtener UNA la relacion videojuegos y mecanicas en particular dado videogame y modifiable mechanic
//WORKS
videogame_mechanic.get('/modifiable_mechanic_videogame/:id_videogame/:id_modifiable_mechanic',jsonParser,  wrap(async(req,res,next)=>{
    var id_videogame = req.params.id_videogame;
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic;

        var path ='/modifiable_mechanic_videogame/'+id_videogame.toString() + '/'+ id_modifiable_mechanic.toString()       
    
    var url = "http://"+sensorHost + path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))

//5) Obtener TODOS los modifiable_mechanic 
//WORKS
videogame_mechanic.get('/modifiable_mechanic_all',jsonParser,  wrap(async(req,res,next)=>{

        var path ='/modifiable_mechanic_all'    
    
    var url = "http://"+sensorHost + path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))
//6) Obtener TODOS los videojuegos 
//WORKS
videogame_mechanic.get('/videogames',jsonParser,  wrap(async(req,res,next)=>{

        var path ='/videogames'       
    
    var url = "http://"+sensorHost + path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))

//7) Obtener TODAS las relaciones videojuegos y mecanicas
//WORKS
videogame_mechanic.get('/modifiable_mechanic_videogame_all',jsonParser,  wrap(async(req,res,next)=>{

        var path ='/modifiable_mechanic_videogame_all'       
    
    var url = "http://"+sensorHost + path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))
/*
CREATE ENDPOINTS:

1) Crear un videogame template 

2) Crear una modifiable_mechanic template 

3) Crear una relacion relaciones videojuegos y mecanicas

*/

//1)Crea un online_sensor 
//WORKS
videogame_mechanic.post('/videogame',jsonParser,  wrap(async(req,res,next)=>{
    var videogame_data = req.body

        var path ='/videogame'       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;
    try {
       
        const response = await axios.post(MEDIUM_POST_URL, videogame_data);
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

//2) Crear una modifiable_mechanic template 
//WORKS
videogame_mechanic.post('/modifiable_mechanic',jsonParser,  wrap(async(req,res,next)=>{
    var modifiable_mechanic_data = req.body

 
        var path ='/modifiable_mechanic'       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;
    try {
       
        const response = await axios.post(MEDIUM_POST_URL, modifiable_mechanic_data);
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

//3) Crear una relacion relaciones videojuegos y mecanicas
//WORKS
videogame_mechanic.post('/modifiable_mechanic_videogame',jsonParser,  wrap(async(req,res,next)=>{
    var modifiable_mechanic_videogame_data = req.body

    var path ='/modifiable_mechanic_videogame'       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;
    try {
       
        const response = await axios.post(MEDIUM_POST_URL, modifiable_mechanic_videogame_data);
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

/*
UPDATE ENDPOINTS:

1) Modificar la info de un videogame 
CASCADE Y CASCADE

2) Modificar la info de un modifiable_mechanic 
CASCADE Y CASCADE

3) Modificar una relacion videogame mechanic dado su id
CASCADE Y CASCADE

4) Modificar una relacion videogame mechanic dado id_modifiable_mechanic y id_videogame

*/

//1) Modificar la info de un videogame 
//WORKS
videogame_mechanic.put('/videogame/:id_videogame',jsonParser,  wrap(async(req,res,next)=>{

    var id_videogame = req.params.id_videogame
    var videogame_data = req.body

    var path ='/videogame/'+id_videogame.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.put(MEDIUM_PUT_URL,videogame_data);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

//2) Modificar la info de un modifiable_mechanic 
//WORKS
videogame_mechanic.put('/modifiable_mechanic/:id_modifiable_mechanic',jsonParser,  wrap(async(req,res,next)=>{
    var id_modifiable_mechanic= req.params.id_modifiable_mechanic

    var modifiable_mechanic_data = req.body

        var path ='/modifiable_mechanic/'+id_modifiable_mechanic.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.put(MEDIUM_PUT_URL,modifiable_mechanic_data);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

//3) Modificar una relacion videogame mechanic dado su id
//WORKS
videogame_mechanic.put('/modifiable_mechanic_videogame/:id_modifiable_mechanic_videogame',jsonParser,  wrap(async(req,res,next)=>{
    var id_modifiable_mechanic_videogame = req.params.id_modifiable_mechanic_videogame

    var relation_data = req.body

        var path ='/modifiable_mechanic_videogame/'+id_modifiable_mechanic_videogame.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.put(MEDIUM_PUT_URL,relation_data);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

//4) Modificar una relacion videogame mechanic dado id_modifiable_mechanic y id_videogame
//WORKS
videogame_mechanic.put('/modifiable_mechanic_videogame/:id_videogame/:id_modifiable_mechanic',jsonParser,  wrap(async(req,res,next)=>{
    var id_videogame = req.params.id_videogame
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic

    var relation_data = req.body

        var path ='/modifiable_mechanic_videogame/'+id_videogame.toString()+'/'+id_modifiable_mechanic.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.put(MEDIUM_PUT_URL,relation_data);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))
/*
DELETE ENDPOINTS:

1) Borrar el videogame  

2) Borrar la mecanica

3) Borrar la relacion videogame y mecanica dado su id

4) Borrar la relacion videogame y mecanica dados sus llaves foraneas id videogame y modifiable_mechanic

*/
//1) Borrar el videogame 
//WORKS
videogame_mechanic.delete('/videogame/:id_videogame',jsonParser,  wrap(async(req,res,next)=>{

    var id_videogame = req.params.id_videogame
    
        var path ='/videogame/'+id_videogame.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.delete(MEDIUM_PUT_URL);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))
//2) Borrar la mecanica 
//WORKS
videogame_mechanic.delete('/modifiable_mechanic/:id_modifiable_mechanic',jsonParser,  wrap(async(req,res,next)=>{
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic

        var path ='/modifiable_mechanic/'+id_modifiable_mechanic.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.delete(MEDIUM_PUT_URL);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

//3) Borrar la relacion videogame y mecanica dado su id
//WORKS
videogame_mechanic.delete('/modifiable_mechanic_videogame/:id_modifiable_mechanic_videogame',jsonParser,  wrap(async(req,res,next)=>{
    var id_modifiable_mechanic_videogame = req.params.id_modifiable_mechanic_videogame

        var path ='/modifiable_mechanic_videogame/'+id_modifiable_mechanic_videogame.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.delete(MEDIUM_PUT_URL);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

// 4) Borrar la relacion videogame y mecanica dados sus llaves foraneas id videogame y modifiable_mechanic
//WORKS
videogame_mechanic.delete('/modifiable_mechanic_videogame/:id_videogame/:id_modifiable_mechanic',jsonParser,  wrap(async(req,res,next)=>{
    var id_videogame = req.params.id_videogame
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic

        var path ='/modifiable_mechanic_videogame/'+id_videogame.toString()+ '/'+id_modifiable_mechanic.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.delete(MEDIUM_PUT_URL);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))


export default videogame_mechanic;

