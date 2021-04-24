const express = require('express');
const conversion = express.Router();
const axios = require('axios').default;
var bodyParser =require('body-parser');

var jsonParser = bodyParser.json()
const sensorHost = "bgames-SensorManagementService:3007"

const wrap = fn => (...args) => fn(...args).catch(args[2])
//CRUD de conversions 
/*
CREATE ENDPOINTS:

1) Crear un conversion 

2) Crear la relacion modifiable_conversion_attribute (equivalente a 'asociarse' a un sensor para un player)

*/

//1)Crea una conversion 
//WORKS
conversion.post('/conversion',jsonParser,  wrap(async(req,res,next)=>{
    var sensorData = req.body
   
    var path ='/conversion'       

    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;
    try {
    
        const response = await axios.post(MEDIUM_POST_URL, sensorData);
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))
//2)Crea una relacion modifiable_conversion_attribute
//WORKS
conversion.post('/modifiable_conversion_attribute',jsonParser,  wrap(async(req,res,next)=>{
    var relation_data = req.body
    var path ='/modifiable_conversion_attribute'       

    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;
    try {
    
        const response = await axios.post(MEDIUM_POST_URL, relation_data);
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))
/*
RETRIEVE CONVERSION:

1) Obtener un conversion en particular 

2) Obtener TODAS las conversion en particular 

3) Obtener TODOS las conversiones relacionados a un sensor_endpoint y los parametros que cambiaron

4) Obtener TODOS las conversiones relacionados a atributos y una mecanica en especial

*/

//1) Obtener un conversion en particular
//WORKS
conversion.get('/conversion/:id_conversion',jsonParser,  wrap(async(req,res,next)=>{
    var id_conversion = req.params.id_conversion
    
    var path ='/conversion/'+id_conversion.toString()       
    
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

//1) Obtener TODAS las conversion en particular 
//WORKS
conversion.get('/conversions_all',jsonParser,  wrap(async(req,res,next)=>{
    var path ='/conversions_all'    
    
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

//3) Obtener TODOS las conversiones relacionados a un sensor_endpoint y los parametros que cambiaron
/*

   var dataChanges ={  
        "id_sensor_endpoint": id_sensor_endpoint, Ej: 5
        "parameters_watched":changedParameters  Ej: ['chess_blitz,records,win', 'elo','puzzle_challenge,record']                                     
    }
    SELECT
    `conversion`.`id_conversion`,
    `conversion`.`id_subattributes`,
    `conversion`.`operations`
FROM
    `conversion`
JOIN `conversion_sensor_endpoint` ON `conversion`.`id_conversion` = `conversion_sensor_endpoint`.`id_conversion`
WHERE
    `conversion_sensor_endpoint`.`id_sensor_endpoint` = 2 AND `conversion`.`parameters_watched` IN ('followers')

*/
conversion.get('/conversions',jsonParser,  wrap(async(req,res,next)=>{
    
    var id_sensor_endpoint = req.body.id_sensor_endpoint;
    var parameters_watched = req.body.parameters_watched;
    var path ='/conversions'    

    var url = "http://"+sensorHost + path;
    const MEDIUM_GET_URL = url;
    
    var body = {
       "id_sensor_endpoint": id_sensor_endpoint,
       "parameters_watched":parameters_watched
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ data: body ,headers:headers})
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))

//4) Obtener TODOS las conversiones relacionados a atributos y una mecanica en especial

conversion.get('/conversion_spend_attribute',jsonParser,  wrap(async(req,res,next)=>{
    var id_videogame = req.body.id_videogame;
    var id_modifiable_mechanic = req.body.id_modifiable_mechanic;
    var path ='/conversion_spend_attribute'    

    var url = "http://"+sensorHost + path;
    const MEDIUM_GET_URL = url;
    
    var body = {
       "id_videogame": id_videogame,
       "id_modifiable_mechanic":id_modifiable_mechanic
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ data: body ,headers:headers})
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))


//UPDATE ENDPOINTS:
//3) Modificar una conversion en especial (name, description, operation)
//WORKS
conversion.put('/conversion/:id_conversion',jsonParser,  wrap(async(req,res,next)=>{

    var id_conversion = req.params.id_conversion
    var new_conversion_data = req.body
    var path ='/conversion/'+id_conversion.toString()  
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.put(MEDIUM_PUT_URL,new_conversion_data);
        console.log(response)
        res.status(200).json(response.data)

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    }
}))

//2) Modificar una relacion conversion atributo y mecanica en especial (id_attributes, id_conversion, id_modifiable_mechanic)
//WORKS
conversion.put('/modifiable_conversion_attribute/:id_attributes/:id_conversion/:id_modifiable_mechanic',jsonParser,  wrap(async(req,res,next)=>{
    var relation_body = req.body

    var id_attributes = req.params.id_attributes
    var id_conversion = req.params.id_conversion
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic

    var path ='/modifiable_conversion_attribute/'+id_attributes.toString()+id_conversion.toString()+id_modifiable_mechanic.toString()
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.put(MEDIUM_PUT_URL,relation_body);
        console.log(response)
        res.status(200).json(response.data)

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    }
}))

//DELETE ENDPOINTS:
conversion.delete('/conversion/:id_conversion',jsonParser,  wrap(async(req,res,next)=>{

    var id_conversion = req.params.id_conversion
    var path ='/id_conversion/'+id_conversion.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.delete(MEDIUM_PUT_URL);
        console.log(response)
        res.status(200).json(response.data)

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))
conversion.delete('/modifiable_conversion_attribute/:id_attributes/:id_conversion/:id_modifiable_mechanic',jsonParser,  wrap(async(req,res,next)=>{

    var id_attributes = req.params.id_attributes
    var id_conversion = req.params.id_conversion
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic

    var path ='/modifiable_conversion_attribute/'+id_attributes.toString()+id_conversion.toString()+id_modifiable_mechanic.toString()
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.delete(MEDIUM_PUT_URL);
        console.log(response)
        res.status(200).json(response.data)

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))



export default conversion;
