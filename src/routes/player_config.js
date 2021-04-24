const express = require('express');
const player_config = express.Router();
const userHost = "bgames-UserManagementService:3010"
const cryptoRandomString = require('crypto-random-string');
var bodyParser =require('body-parser');
var jsonParser = bodyParser.json()
const axios = require('axios').default;

import admin from '../bin/auth'
import confirmLogs from '../bin/www';

const wrap = fn => (...args) => fn(...args).catch(args[2])

var nodemailer = require('nodemailer');
var officialMail =  {
    user: 'blendedgamesframework@gmail.com',
    pass: 'OnlineOffline42'
}
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: officialMail
});



/*
Input: Id of a player (range 0 to positive int)
Output: Name, password and age of that player
Description: Calls the b-Games-Configurationservice service to get the player's information
*/
player_config.get('/getPlayerConfig/:id', (req,res,next)=>{
    var post_data = req.body;
    const{id}= req.params;
    var options = {
        host : 'bgames-configurationservice.herokuapp.com',
        path: ('/players/'+id),
        method: 'GET'
      };
    common.getJson(options,function(err,result){
        if(err){
            console.log("No hay resultado");//ACA ESTA EL RESULTADO
            res.json("Error in user config: get");
        }
        else{
            console.log(result);//ACA ESTA EL RESULTADO
            res.json(result);
        }
    });

})
function createKey(){
    let key = cryptoRandomString({length:15})
    return key
}

player_config.post('/logout/:id_player',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;
    const io = req.app.locals.io
    const confirmLogsReplica = req.app.locals.confirmLogsReplica
    if(confirmLogsReplica !== undefined){
        let user_index = -1
        confirmLogsReplica.forEach((user,index) => {
            if(user.id === id_player){
                  user_index = index
            }        
        }); 
        console.log(confirmLogsReplica)
        confirmLogs[user_index].log = false 
        io.of("/authentication").in(id_player.toString()).emit('logout')
        res.status(200).json({message:"Logout notificado"})

    }
    else{
        res.status(200).json({message:"Logout notificado"})

    }

}))
player_config.get('/player_already_logged_desktop_app/:id_player',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;
    const confirmLogsReplica = req.app.locals.confirmLogsReplica
    let user_index = -1
    try {
        confirmLogsReplica.forEach((user,index) => {
            if(user.id === id_player){
              user_index = index
            }        
        }); 
        if(user_index !== -1){
            if(confirmLogsReplica[user_index].log){
                res.status(200).json({message:true})
            }
            else{
                res.status(200).json({message:false})
            }
        }
        else{
             res.status(200).json({message:false})
        }

    } catch(e){
        res.status(200).json({message:false})

    }
   
}))


player_config.get('/create_desktop_key/:id_player',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;

    var path = '/create_desktop_key/'+id_player.toString()
    var url = "http://"+userHost + path;
    const MEDIUM_POST_URL = url;
    console.log('Forcing push')
    
    let key = createKey()
    console.log(key)
    const data = {
        "key": key
    }

    try {
        const response = await axios.post(MEDIUM_POST_URL,data)
        res.status(200).json(JSON.stringify(response.data))
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))

var interval;

async function deleteKey(id_player){
    clearInterval(interval)
    console.log(id_player)
    const data = {
        key: null
    }
    const GET_KEY_URL = "http://"+userHost+'/create_desktop_key/'+id_player
    try {
        const reply = await axios.post(GET_KEY_URL,data)
        console.log(reply)


    } catch (error) {
        console.log(error)
    }
}

player_config.post('/sendEmailConfirmation',jsonParser,  wrap(async(req,res,next)=>{
    var password = req.body.password;
    var email = req.body.email;
    var hiddenLink = 'http://144.126.216.255:8080/confirmEmail/'+email+'/'+password
    var link = 'http://144.126.216.255:8080/confirmEmail'

    var mailOptions = {
        from: officialMail.user,
        to: email,
        subject: 'Verificacion de email en Blended Games para el usuario '+email,      
        html:"<p>Hola "+email+ "</p> <p>Presiona el siguiente link para confirmar su email</p><p><a href='"+hiddenLink+"'>"+link+"</a></p><p>Si no solicitó verificar esta dirección, puede ignorar este correo electrónico.</p><p>El equipo de Blended Games :)</p>"
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });  
    res.status(200).json({ message: 'Mail enviado' })

}))



player_config.post('/desktop_authentication_key',jsonParser,  wrap(async(req,res,next)=>{

    const io = req.app.locals.io
    console.log("player_config: linea numero 89",req.app.locals.index)
    console.log("player_config: linea numero 90",confirmLogs)

    let keys = Object.keys(req.body)
    console.log(keys)
    let properJSON = JSON.parse(keys[0])
    console.log(properJSON)
    var email = properJSON.email;
    var password = properJSON.password;
    var desktop_key = properJSON.key;
    var provider = properJSON.provider;

    console.log("player_config: linea numero 101",req.body)

    var path = '/player_by_email/'+email
    var url = "http://"+userHost + path;
    const MEDIUM_GET_URL = url;

    try {
        const response = await axios.get(MEDIUM_GET_URL)

        var actual_data = JSON.parse(response.data)
        console.log("player_config: linea numero 111",actual_data)
        if(actual_data.id_players !== null){
            console.log('pase por id_players')
            if(actual_data.desktop_key !== null){
                console.log('pase por desktop_key')
                console.log(actual_data.desktop_key)
                console.log(desktop_key)

                if(actual_data.desktop_key === desktop_key ){
                    console.log('Pase por la igualdad de llaves')

                    admin
                    .auth()
                    .getUser(actual_data.external_id)
                    .then((userRecord) => {
                        console.log('encontre el usuario con ', actual_data.external_id)
                        // See the UserRecord reference doc for the contents of userRecord.
                        console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
                        var user = userRecord.toJSON()
                        console.log(user.providerData)
                        console.log(user.providerData[0].providerId)
                        if(user.providerData[0].providerId !== provider ){
                            res.status(404).json({ message: 'Tipo de cuenta incorrecta' })
                        }
                        else{                            
                            if(actual_data.external_type === 'firebase.com'){              
                                //Las claves se guardan hashed base 64 encoded
                                //TODO                  
                                if(user.providerData.providerId === password){
                                    
                                    deleteKey(actual_data.id_players)
                                    io.of("/authentication").in(actual_data.id_players.toString()).emit('keyUsed')
                                    res.status(200).json({ id_player:actual_data.id_players , message: 'Autenticacion correcta' })

                                }
                                else{
                                    res.status(400).json({ message: 'Constraseña incorrecta' })

                                }
                                //if userRecord.password === password && userRecord.logged In  => autorizado
                                //userRecord.logged In == false ==> suplantacion
                            }
                            else{
                                //Proveedor
                                var message = 'Se esta tratando de autenticar en la aplicacion de escritorio de Blended Games con sus datos, confirme que es usted'
                                
                                io.of("/authentication").in(actual_data.id_players.toString()).emit('confirmUser', message)
                                var time = 120 //sec, 2 min
                                console.log("player_config: linea numero 156",confirmLogs[req.app.locals.index])
                                
                                interval = setInterval( () => {
                                    console.log(time)
                                    let userLog = confirmLogs[req.app.locals.index]
                                    console.log(userLog)

                                    if(userLog === undefined){
                                        userLog = false
                                    }
                                    else{
                                        userLog =  confirmLogs[req.app.locals.index].log
                                    }
                                    console.log(userLog)
                                    if(userLog){
                                        console.log("player_config: linea numero 160",userLog)
                                        //confirmLogs[req.app.locals.index].log = false 
                                        deleteKey(actual_data.id_players)
                                        io.of("/authentication").in(actual_data.id_players.toString()).emit('keyUsed')

                                        res.status(200).json({ id_player:actual_data.id_players , message: 'Autenticacion correcta' })
                                    }
                                    else if(time > 0){
                                        time--
                                    }
                                    else{
                                        console.log("player_config: linea numero 180",actual_data)
                                        console.log("player_config: linea numero 181",actual_data.id_players)
                                        deleteKey(actual_data.id_players)
                                        res.status(400).json({ message: 'Se acabo el tiempo' })
                                    }
                              }, 1000 )

                            }

                        }
                     
                    })
                    .catch((error) => {
                        console.log('No se pudo encontrar el usuario')
                        console.log('Error fetching user data:', error);
                    });                 


                }
                else{
                    console.log('La llave de autenticacion no se corresponde con la creada, porfavor revisarla')

                    res.status(404).json({ message: 'La llave de autenticacion no se corresponde con la creada, porfavor revisarla' })

                }
            }
            else{
                console.log('No se encontro una llave de autenticacion, revisar si la ha generado en la plataforma web')

                res.status(404).json({ message: 'No se encontro una llave de autenticacion, revisar si la ha generado en la plataforma web' })
            }
        }
        else{
            console.log('Usuario con ese mail no existe')

            console.error(error);
            res.status(404).json({ message: 'Usuario con ese mail no existe' })
        }
        
    } 
    catch (error) {
        console.log('No responde el servicio de administracion de sensores, intente nuevamente')
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))
/*
Input: Id of a player (range 0 to positive int)
Output: Void (Modifies the name, pass and age of a player)
Description: Calls the b-Games-Configurationservice service to edit the player's information
*/
//Faltan todos los verificadores de si cumple con los requerimientos o faltan datos!
player_config.put('/getPlayerConfig/edit/:id', (req,res,next)=>{
    //var headersIN = req.body;
    const headersIN = JSON.stringify(req.body);

    

    const {name,pass,age} = req.body;
    const{id}= req.params;
    console.log("cuanto es: "+headersIN);
    if ( !common.isNumber(Number(id)) || !common.isString(name) || !common.isString(pass) || !(common.isNumber(age))){
        console.log('This is not a player'+  typeof(Number(id)) + common.isString(name) + common.isString(pass) + common.isNumber(age));
        res.json("Error in user config: not user");
    }
    else{
        const data = JSON.stringify({
            name: name,
            pass:pass,
            age:age
          });
        console.log("cuanto es2: "+data);
        
        var options = {
            host : 'bgames-configurationservice.herokuapp.com',
            path: ('/players/'+id),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
              }
        };
        common.getJsonSend(options,data,function(err,result){
            if(err){
                console.log("No hay resultado");//ACA ESTA EL RESULTADO
                res.json("Error in user config: get");
            }
            else{
                console.log(result);//ACA ESTA EL RESULTADO
                res.json(result);
            }
        });
    }

})



/*
Input: Nothing
Output: List of all the players of Blended Games
Description: Simple MYSQL query
*/
player_config.get('/players/',(req,res)=>{
    var aux = undefined;
    mysqlConnection.query('SELECT*FROM playerss',(err,rows,fields)=>{
        try{
            aux = JSON.parse(JSON.stringify(rows))[0]
        }catch{
            res.json("Error in parse Json, please retry");
        }
        if (undefined == aux){
            res.json("Error on obtain resume");
        }else{
            if(!err){
                res.json(rows);
            } else {
                console.log(err);
            }
        }
    })
})
player_config.get('/players/id',(req,res)=>{
    var aux = undefined;
    mysqlConnection.query('SELECT id_players FROM playerss',(err,rows,fields)=>{
        try{
            aux = JSON.parse(JSON.stringify(rows))[0]
        }catch{
            res.json("Error in parse Json, please retry");
        }
        if (undefined == aux){
            res.json("Error on obtain resume");
        }else{
            if(!err){
                res.json(rows);
            } else {
                console.log(err);
            }
        }
    })
})
/*
Input: Id of a player (range 0 to positive int)
Output: Name, pass and age of that player
Description: Simple MYSQL query
*/
player_config.get('/players/:id', (req,res) =>{
    const {id} = req.params;
    console.log("entro en el GET");
    var aux = undefined;
    mysqlConnection.query('SELECT*FROM playerss WHERE id_players = ?',[id],(err,rows,fields) =>{
        try{
            aux = JSON.parse(JSON.stringify(rows))[0]
        }catch{
            res.json("Error in parse Json, please retry");
        }
        if (undefined == aux){
            res.json("Error on GET player information.");
        }else{
            if(!err){
                console.log("Entro a Configuración");
                res.json(rows); 
            } else {
                console.log(err);
            }
        }
    })
})
/*
Input: Id of a player (range 0 to positive int)
Output: Void (authentication of the player in the system)
Description: Simple MYSQL query
*/
player_config.get('/player/:name/:pass', (req,res) =>{
    var aux = undefined;
    const name = req.params.name
    const pass = req.params.pass
    mysqlConnection.query('SELECT*FROM playerss WHERE name = ? AND password = ?',[name, pass],(err,rows,fields) =>{
        try{
            aux = JSON.parse(JSON.stringify(rows))[0]
        }catch{
            res.json("Error in parse Json, please retry");
        }
        if (undefined == aux){
            res.status(400).json("Error on GET player information.");
        }else{
            if(!err){
                console.log("Entro a Configuración");
                res.json(rows[0].id_players);
            } else {
                res.status(404).json("Player doesnt exist or incorrect password");
                console.log(err);
            }
        }
    })
    
})


// OPCIONES DE CONFIGURACION

// add or eddit player, hay que probarlo!!!!! parece que esta malo un Not o un True del 1er if
/*
Input: Name, pass and age of that player
Output: Void (Creates a new player with the input information)
Description: Simple MYSQL query
*/
player_config.post('/players/',(req,res)=>{
    const {name,pass,age} = req.body;
    console.log(req.body);
    const id = 0;
    const query = `
        SET @id = ?;
        SET @name = ?;
        SET @pass = ?;
        SET @age = ?;
        CALL playerAddOrEdit(@id,@name,@pass,@age);
    `;
    // Mirar este select!!!
    mysqlConnection.query('SELECT*FROM playerss WHERE id_players = ?',[id],(err,rows,fields)=>{
        console.log("El selec entrega: "+!err);
        if(!err){
            if(!!rows){
                mysqlConnection.query(query,[id,name,pass,age],(err,rows,fields) =>{
                    if(!err){
                        res.json({Status:'Player Saved'});
                    } else {
                        console.log(err);
                    }
                })
            }
        } else {
            console.log(err);
            res.json({Status:'ERROR: Player Saved'});
        }
    })
})

/*
Input: Name, pass and age of that player
Output: Void (Edits an existing player in the db)
Description: Simple MYSQL query
*/
//Con id en 0 se ingresa un nuevo jugador, con cualquier otro id se edita el existente
player_config.put('/players/:id',(req,res)=>{
    console.log("entro en el PUT");
    const {name,pass,age} = req.body;
    const {id} = req.params;
    //console.log("El selec entrega: "+JSON.parse(JSON.stringify(req.body))[0]);
    const query = `
            SET @id = ?;
            SET @name = ?;
            SET @pass = ?;
            SET @age = ?;
            CALL playerAddOrEdit(@id,@name,@pass,@age);
    `;
    mysqlConnection.query('SELECT*FROM playerss WHERE id_players = ?',[id],(err,rows,fields)=>{
        console.log("El selec entrega: "+rows);try{
            aux = JSON.parse(JSON.stringify(rows))[0]
        }catch{
            res.json("Error in parse Json, please retry");
        }
        if (undefined != aux){
            mysqlConnection.query(query,[id,name,pass,age],(err,rows,fields) =>{
                if(!err){
                    res.json({Status:'Player Update'});
                    console.log("Lo logró");
                } else {
                    res.json({Status:'ERROR: Player Update'});
                    console.log(err);
                }
            })
        }else{
            res.json({Status:'ERROR: Player not exists'});
        }
    })

})
/*
Input: Id of a player (range 0 to positive int)
Output: Void (Deletes the player of the database)
Description: Simple MYSQL query
*/
player_config.delete('/players/:id',(req,res)=>{
    const {id} = req.params;
    mysqlConnection.query('DELETE FROM playerss WHERE id_players =?',[id],(err,rows,fields)=>{
        if(!err){
            res.json({Status:'Player Deleted'});
        } else {
            console.log(err);
        }
    })
})

export default player_config;