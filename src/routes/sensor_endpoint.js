const express = require('express');
const sensor_endpoint = express.Router();
const axios = require('axios').default;
var bodyParser =require('body-parser');
const Twitter = require('twitter-v2');

var jsonParser = bodyParser.json()
const client_twitter = new Twitter({
    bearer_token: process.env.BEARER_TOKEN,
});

const wrap = fn => (...args) => fn(...args).catch(args[2])
const sensorHost = "bgames-SensorManagementService:3007"

/* Ejemplo de Json del online sensor
    {
        "id_online_sensor": 2,
        "name": "Chess.com Public api",
        "description": "Public API of the chess website chess.com",
        "base_url": "https://api.chess.com/pub/",
        "intiated_date": "2019-05-16 13:17:17" //Cuando se creo
    }
*/
/* Ejemplo de Json del sensor_endpoint
    {
        "id_online_sensor": 2,
        "name": "Instagram",
        "description": "General instagram api",
        "base_url": "graph.instagram.com",
        "intiated_date": "2019-05-16 13:17:17" //Cuando se creo
    }
*/

/* 
CRUD de sensor_endpoints 
*/

/*
RETRIEVE ONLINE_SENSORS:

1) Obtener UN sensor_endpoint en particular relacionado a un player y online_sensor

2) Obtener TODOS los sensor_endpoint (activated y desactivated) relacionados a un player y online_sensor

3) Obtener TODOS los sensor_endpoint (activated) relacionados a un player y online_sensor

4) Obtener TODOS los sensor_endpoint (desactivated) relacionados a un player y online_sensor

5) Obtener TODOS los sensor_endpoint de un player en particular (activated y deactivated)(tomando en cuenta todos los online_sensor que tiene)

6) Obtener TODOS los sensor_endpoint de un player en particular (activated)(tomando en cuenta todos los online_sensor que tiene)

7) Obtener TODOS los sensor_endpoint de un player en particular (deactivated)(tomando en cuenta todos los online_sensor que tiene)

8) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated y deactivated)(sin importar de que players son)

9) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated )(sin importar de que players son)

10) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (deactivated)(sin importar de que players son)

11) Obtener TODOS los sensor_endpoints (activated y deactivated) de TODOS los players

12) Obtener TODOS los sensor_endpoints (activated) de TODOS los players

13) Obtener TODOS los sensor_endpoints (deactivated) de TODOS los players

*/

/* WORKS 
SELECT DISTINCT
    `playerss`.`id_players`,
    `online_sensor`.`id_online_sensor`,
    `sensor_endpoint`.`id_sensor_endpoint`,
    `playerss_online_sensor`.`tokens`,
    `online_sensor`.`name`,
    `online_sensor`.`description`, 
    `online_sensor`.`base_url`,
    `online_sensor`.`initiated_date`,
    `online_sensor`.`last_modified`,
    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`parameters_watched`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time`,
    `sensor_endpoint`.`initiated_date`,
    `sensor_endpoint`.`last_modified`

FROM
    `playerss`
JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players`
JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor`
JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor`
WHERE
    `playerss`.`id_players` IN(1, 2, 3, 4, 5, 6)  
ORDER BY `playerss`.`id_players` ASC


*/
//1) Obtener UN sensor_endpoint en particular relacionado a un player y online_sensor

/*
SELECT 
    `playerss`.`id_players`,
    `online_sensor`.`id_online_sensor`,
    `sensor_endpoint`.`id_sensor_endpoint`,
    `playerss_online_sensor`.`tokens`,
    `online_sensor`.`name`,
    `online_sensor`.`description`,
    `online_sensor`.`base_url`,
    `online_sensor`.`initiated_date`,
    `online_sensor`.`last_modified`,
    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`parameters_watched`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time`,
    `sensor_endpoint`.`initiated_date`,
    `sensor_endpoint`.`last_modified`
FROM
    `playerss`
JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players`
JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor`
JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor`
WHERE
     `playerss`.`id_players` = 1 AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = 1  AND `sensor_endpoint`.`id_players` = 1 AND `sensor_endpoint`.`url_endpoint` = "player/{username}/stats"

*/
//1) Obtener UN sensor_endpoint en particular relacionado a un player y online_sensor

//WORKS
sensor_endpoint.get('/sensor_endpoint/:id_player/:id_online_sensor/:id_sensor_endpoint',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;
    var id_sensor_endpoint = req.params.id_sensor_endpoint;

    var path = '/sensor_endpoint/'+id_player.toString()+'/'+id_online_sensor.toString+'/'+id_sensor_endpoint.toString()      
   
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

//2) Obtener TODOS los sensor_endpoint (activated y desactivated) relacionados a un player y online_sensor
//WORKS
sensor_endpoint.get('/sensor_endpoints/:id_player/:id_online_sensor',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;
    var path = '/sensor_endpoint/'+id_player.toString()+'/'+id_online_sensor.toString()   
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

//3) Obtener TODOS los sensor_endpoint (activated) relacionados a un player y online_sensor
//WORKS

sensor_endpoint.get('/sensor_endpoints_activated/:id_player/:id_online_sensor',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    var path = '/sensor_endpoints_activated/'+id_player.toString()+'/'+id_online_sensor.toString()
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

//4) Obtener TODOS los sensor_endpoint (desactivated) relacionados a un player y online_sensor
//WORKS

sensor_endpoint.get('/sensor_endpoints_deactivated/:id_player/:id_online_sensor',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    
   
    var path = '/sensor_endpoints_deactivated/'+id_player.toString()+'/'+id_online_sensor.toString()
    
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

//5) Obtener TODOS los sensor_endpoint de un player en particular (activated y deactivated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS

sensor_endpoint.get('/sensor_endpoints/:id_player',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;
    var path = '/sensor_endpoints/'+id_player.toString()       
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
//6) Obtener TODOS los sensor_endpoint de un player en particular (activated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS
sensor_endpoint.get('/sensor_endpoints_activated/:id_player',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;

    var path = '/sensor_endpoints_activated/'+id_player.toString()       

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
//7) Obtener TODOS los sensor_endpoint de un player en particular (deactivated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS
sensor_endpoint.get('/sensor_endpoints_deactivated/:id_player',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;
    
    var path ='/sensor_endpoints_deactivated/'+id_player.toString()
  
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

//8) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated y deactivated)(sin importar de que players son)
//WORKS
sensor_endpoint.get('/online_sensor/:id_online_sensor/sensor_endpoints',jsonParser,  wrap(async(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

   
    var path = '/online_sensor/'+id_online_sensor.toString()+'/sensor_endpoints'       
 
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
//9) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated)(sin importar de que players son)
//WORKS
sensor_endpoint.get('/online_sensor/:id_online_sensor/sensor_endpoints_activated',jsonParser,  wrap(async(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;
    var path = '/online_sensor/'+id_online_sensor.toString()+'/sensor_endpoints_activated'       
    
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
//10) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (deactivated)(sin importar de que players son)
//WORKS
sensor_endpoint.get('/online_sensor/:id_online_sensor/sensor_endpoints_deactivated',jsonParser,  wrap(async(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var path = '/online_sensor/'+id_online_sensor.toString()+'/sensor_endpoints_deactivated'       
    
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

//11) Obtener TODOS los sensor_endpoints (activated y deactivated) de TODOS los players
/* WORKS */

sensor_endpoint.get('/sensor_endpoints',jsonParser,  wrap(async(req,res,next)=>{
  
    var path = '/sensor_endpoints'
    
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

//12) Obtener TODOS los sensor_endpoints (activated) de TODOS los players
/* WORKS */

sensor_endpoint.get('/sensor_endpoints_activated',jsonParser,  wrap(async(req,res,next)=>{
   
    var path = '/sensor_endpoints_activated'      
    
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


//13) Obtener TODOS los sensor_endpoints (deactivated) de TODOS los players
/* WORKS */


sensor_endpoint.get('/sensor_endpoints_deactivated',jsonParser,  wrap(async(req,res,next)=>{
    
    var path = '/sensor_endpoints_deactivated'     
    
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


1) Crear un sensor_endpoint asociado a un jugador y online_sensor 
    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`parameters_watched`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time` 

*/

//1)Crea asociacion de un jugador a un sensor_endpoint en especifico

sensor_endpoint.post('/sensor_endpoint/:id_player/:id_sensor_endpoint',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_sensor_endpoint = req.params.id_sensor_endpoint;
    var sensor_endpoint_data = req.body

    var path = '/sensor_endpoint/'+id_player.toString()+'/'+id_sensor_endpoint.toString()      
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;
    try {
       
        const response = await axios.post(MEDIUM_POST_URL, sensor_endpoint_data);
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

//2)Crea un sensor_endpoint template 

sensor_endpoint.post('/sensor_endpoint/:id_online_sensor',jsonParser,  wrap(async(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var sensor_endpoint_data = req.body
  
    var path = '/sensor_endpoint/'+id_online_sensor.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;
    try {
       
        const response = await axios.post(MEDIUM_POST_URL, sensor_endpoint_data);
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
}))

//TWITTER 
sensor_endpoint.post('/twitter_specific_parameter_call',jsonParser,  wrap(async(req,res,next)=>{
    var name = req.body.name
    var tokens = req.body.tokens
    var token_parameters = req.body.token_parameters
    var parameters_template = req.body.parameters_template
    var header_parameters = req.body.header_parameters
    var data = req.body.data

    console.log(req.body)

    
    let search_param = parameters_template.search_data.search_param
    let retrieve_param = parameters_template.search_data.retrieve_param
    let url = parameters_template.search_data.url
    let reply 

    if(name === 'Estadisticas de un tweet' || name === 'Estadisticas de multimedia'){
        header_parameters['ids'] = data
        console.log(header_parameters)
        //reply = await client_twitter.get(url, header_parameters);
        reply = await client_twitter.get(url,header_parameters);
        console.log(reply)
        console.log(reply.data[0] )
        console.log(reply.data[0].author_id )
        console.log(tokens)
        console.log(tokens.id)
        if(reply.data[0].author_id === tokens.id){
            //El tweet lo hizo el usuario
            console.log('autenticado')
            if(name === 'Estadisticas de multimedia'){
                if(reply.hasOwnProperty("includes")){
                    let aux_data = reply.includes
                    if(aux_data.hasOwnProperty("media")){
                        res.status(200).json({ message: 1, retrieve_param:data })

                    }
                    else{
                        res.status(200).json({ message: 0, retrieve_param:data })

                    }

                }
                else{
                    res.status(200).json({ message: 0, retrieve_param:data })

                }

                
            }
            else{
                res.status(200).json({ message: 1, retrieve_param:data })
            }


        }
        else{ 
            console.log('falso')
            res.status(200).json({ message: 0 })

        }
        

    }
}))

/*
UPDATE ENDPOINTS:

1) Modificar la info del sensor endpoint asociado a un player y un online_sensor

    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`parameters_watched`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time` 

*/
//1) Modificar la info del sensor endpoint asociado a un player

sensor_endpoint.put('/sensor_endpoint/:id_players/:id_sensor_endpoint',jsonParser,  wrap(async(req,res,next)=>{
    var id_players = req.params.id_players
    var id_sensor_endpoint = req.params.id_sensor_endpoint

    var sensor_endpoint_data = req.body

    var path = '/sensor_endpoint/'+id_players.toString()+'/id_sensor_endpoint/'+id_sensor_endpoint.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.put(MEDIUM_PUT_URL,sensor_endpoint_data);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 

}))
//2) Modificar la info del sensor endpoint template 

sensor_endpoint.put('/sensor_endpoint/:id_online_sensor/:id_sensor_endpoint',jsonParser,  wrap(async(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor
    var id_sensor_endpoint = req.params.id_sensor_endpoint

    var sensor_endpoint_data = req.body

    var path = '/sensor_endpoint/'+id_online_sensor.toString()+'/'+id_sensor_endpoint.toString()       
    
    var url = "http://"+sensorHost + path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = await axios.put(MEDIUM_PUT_URL,sensor_endpoint_data);
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

1) Borrar el sensor_endpoint template
Causa: No existen repercusiones a otras tablas actualmente
*/

sensor_endpoint.delete('/sensor_endpoint/:id_sensor_endpoint',jsonParser,  wrap(async(req,res,next)=>{

    var id_sensor_endpoint = req.params.id_sensor_endpoint

    var path = '/sensor_endpoint/'+id_sensor_endpoint.toString()       
    
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
/*
2) Borrar la relacion entre jugador y sensor_endpoint (players_sensor_endpoint)
Causa: No existen repercusiones a otras tablas actualmente
*/

sensor_endpoint.delete('/sensor_endpoint/:id_players/:id_sensor_endpoint',jsonParser,  wrap(async(req,res,next)=>{
    var id_players = req.params.id_players

    var id_sensor_endpoint = req.params.id_sensor_endpoint

   
    var path = '/sensor_endpoint/'+id_players.toString()+'/'+id_sensor_endpoint.toString()       
    
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





export default sensor_endpoint;

