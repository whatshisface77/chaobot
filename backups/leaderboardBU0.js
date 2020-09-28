const Discord = require('discord.js');
const fs = require('fs');
var mysql = require('mysql');

var resultData;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ty66rt4532as",
    database: "sonic"
  });

async function selectData(){

    await con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "SELECT name, time FROM totdCurrent";
        con.query(sql, function(err, result, fields) {
            if(err) throw err;
            resultData = result[0].name;
            console.log(resultData);
        });
    });

    console.log("This is after the connection when it is returned: " + resultData);
    return resultData;
}

module.exports = {
    name: 'leaderboard',
    description: "Lists the leaderboard, ranking the players of the 'track of the day' by time!",
 
    execute(message,args){

            data = selectData();
            console.log("this is in execute: " + data);
            const leaderEmbed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle(":trophy: LEADERBOARD :trophy:")
                .setDescription("\n:first_place: **1st: N/A** - 00:00:00 \n :second_place: **2nd: N/A** - 00:00:00 \n :third_place: **3rd: N/A** - 00:00:00")
                 
            message.channel.send(leaderEmbed);


    }
}