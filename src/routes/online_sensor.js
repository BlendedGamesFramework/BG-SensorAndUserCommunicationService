const express = require('express');
const online_sensor = express.Router();
const axios = require('axios').default;
var bodyParser =require('body-parser');
import { testEnvironmentVariable } from '../settings';

var jsonParser = bodyParser.json()
const sensorHost = "bgames-SensorManagementService:3007"

const wrap = fn => (...args) => fn(...args).catch(args[2])
/*

TODO: DELETE

*/


online_sensor.get("/", (req,res) =>{
    res.status(200).json({ message: testEnvironmentVariable})

});

/* Ejemplo de Json del online sensor
    {
        "id_online_sensor": 2,
        "name": "Instagram",
        "description": "General instagram api",
        "base_url": "https://graph.instagram.com/",
        "intiated_date": "2019-05-16 13:17:17" //Cuando se creo
    }
*/
/* Ejemplo de Json de la relacion players_online_sensor
    {
        "id_players_online_sensor": 1,
        "id_players": 2, //Jugador con id = 2
        "id_online_sensor": 2, //Sensor con id = 2 (en este caso de ejemplo concuerda que es el de Instagram)
        "tokens": {
            //Aqui se ponen los tokens de autenticacion de las api y los diferentes permisos que puedan existir
            "access_token":"{long-lived-access-token}", 
        }
    }
*/


/* 
CRUD de sensores y activate/deactivate
*/

/*
RETRIEVE ONLINE_SENSORS:

1) Obtener un online_sensor en particular 

2) Obtener TODOS los online_sensors relacionados a un player

3) Obtener TODOS los online_sensors de todos los players

4) Obtener TODAS las relaciones players_online_sensor

*/


//1) Obtener un online_sensor en particular 
//WORKS
online_sensor.get('/sensor/:id_online_sensor',jsonParser,  wrap(async(req,res,next) =>{
    var id_online_sensor = req.params.id_online_sensor;

        var path ='/sensor/'+id_online_sensor.toString()       
    
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
//2) Obtener TODOS los online_sensors relacionados a un player
//WORKS
online_sensor.get('/sensor_player/:id_player',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;
    
        var path ='/sensor_player/'+id_player.toString()       
    
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


//3) Obtener TODOS los online_sensors asociados a players de TODOS los players
//WORKS
online_sensor.get('/sensors',jsonParser,  wrap(async(req,res,next)=>{
    
        var path ='/sensors'       
    
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

1) Crear un online_sensor 

2) Crear la relacion players_online_sensor (equivalente a 'asociarse' a un sensor para un player)

*/

//1)Crea un online_sensor 
//WORKS
online_sensor.post('/sensor',jsonParser,  wrap(async(req,res,next)=>{
    var sensorData = req.body
   
        var path ='/sensor'       
    
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

//2) Crea la relacion players_online_sensor
//WORKS
online_sensor.post('/sensor_relation/:id_player/:id_online_sensor',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player
    var id_online_sensor = req.params.id_online_sensor
    var tokens = (req.body.tokens)

        var path ='/sensor_relation/'+id_player.toString()+'/'+id_online_sensor.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;
    try {
       
        const response = await axios.post(MEDIUM_POST_URL, tokens);
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))



/*
UPDATE ENDPOINTS:

1) Modificar la info del sensor (name, description, base_url)
CASCADE Y CASCADE

2) Modificar los tokens de la relacion players_online_sensor
CASCADE Y CASCADE

*/

//1) Modificar la info del sensor (name, description, base_url)
//WORKS
online_sensor.put('/sensor/:id_online_sensor',jsonParser,  wrap(async(req,res,next)=>{

    var id_online_sensor = req.params.id_online_sensor
    var newSensorData = req.body

        var path ='/sensor/'+id_online_sensor.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.put(MEDIUM_PUT_URL,newSensorData);
        console.log(response)
        res.status(200).json(response.data)

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

//2) Modificar los tokens de la relacion players_online_sensor
//WORKS
online_sensor.put('/sensor_relation/:id_player/:id_online_sensor',jsonParser,  wrap(async(req,res,next)=>{
    var id_player= req.params.id_player

    var id_online_sensor = req.params.id_online_sensor

    var data_body = req.body

        var path ='/sensor_relation/'+id_player.toString()+'/'+id_online_sensor.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = axios.put(MEDIUM_PUT_URL,data_body);
        console.log(response)
        res.status(200).json(response.data)

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

/*
DELETE ENDPOINTS:

1) Borrar el online_sensor  
Causa: Borrar todos los sensor_endpoints relacionados al online_sensor y todas las relaciones players_online_sensor
on delete on update
CASCADE Y CASCADE

2) Borrar la relacion playerss_online_sensor (equivalente a 'desasociarse' de un sensor para un player)
Causa: Nada debido a que no se borra el sensor ni el player
on delete on update
NO ACTION Y CASCADE
*/
//1) Borrar el online_sensor 
//WORKS
online_sensor.delete('/sensor/:id_online_sensor',jsonParser,  wrap(async(req,res,next)=>{

    var id_online_sensor = req.params.id_online_sensor

        var path ='/sensor/'+id_online_sensor.toString()       
    
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
//2) Borrar la relacion playerss_online_sensor (equivalente a 'desasociarse' de un sensor para un player)
//WORKS
online_sensor.delete('/sensor_relation/:id_player/:id_online_sensor',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player

    var id_online_sensor = req.params.id_online_sensor

        var path ='/sensor_relation/'+id_player.toString()+'/'+id_online_sensor.toString()       
    
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
export default online_sensor;

