const Discord = require('discord.js');

const stats = require("../models/stats.js");
const mongoose = require("mongoose");

const sort = require("../js/sort.js");
const dataManage = require("../js/data.js");

//track.json is where the set variables for which track and character will be used are stored until the next day rotation
var trackData = require("../data/track.json");


//Responsible for finding the immediate placement of the submitted time
async function getRank(time){
  var timeArray = await sort.timeSort();
  var rankNum;
  for(i = 0; i < timeArray.length ; i++){
    if(timeArray[i] == time){
      rankNum = i + 1;
      return rankNum;
    }
  }
  return 0;
}

//In charge of submitting the actual data into the MongoDB Collection as a full Stats Model
async function submit(message, record){

    //All messages must be in xx:xx:xx format, if not, return false and dont submit anything
    const format = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/;

    if(!format.test(record)){
        return false;
    }else{

    var sameUser = true;
    var userTime;

    //Check if this user already has a time, if so, then update and end submit function
    await stats.findOne({user: message.member.user.username}, async function(err, result){
        if(err){
          result.send(err);
        }if(!result){
          sameUser = false;
        }else{
          var oldTime = await dataManage.convert(result.time);
          var newTime = await dataManage.convert(record);

          //Now let's check if the new time is actually faster than the old one, if not, warn that bitch
          if(oldTime < newTime){

              message.channel.send('**WARNING:** The time you would like to submit, **' + record + '**, is not faster than the time you have stored in our system, **' + result.time + '**. If this is unintentional, feel free to re-submit your faster time using the !submit command. If this is intentional, ignore this message.');

              //TODO: Put something here that allows for delayed message with extra response to confirm slower time (ex. Discord Message Collector)    
          }


          result.time = record;
          result.save(function (err) {
            if (err)
            {
                result.send(err);
            }
            
        });
        }
    });

    if(!sameUser){

        //If the format is good and the user is new, create new model to hold data
        const statSubmit = new stats ({
            _id: mongoose.Types.ObjectId(),
            user: message.member.user.username,
            time: record
        });

        statSubmit.save()
        .then(result=>console.log(result))
        .catch(err=>console.log(err));
    }

    return true;
    }

}

//Send the embedded message
module.exports = {
    name: 'submit',
    description: "Allows users to submit their time record for the current track of the day!",
       
    
     async execute(message,args){

      var course = trackData.track;
      var char = trackData.character;

      if(course == -1 || char == -1){

        message.channel.send("There is no current Track of the Day, please await any further messages regarding information about the next Track.");

      }else{
      
        var send = await submit(message, args[0]);
        var rank = await getRank(args[0]);

        //If what is returned by send is true, that means it follows format, so display success message
        if(send){

          const leaderEmbed = new Discord.MessageEmbed()
              .setColor('#FF0000')
              .setTitle("Good job " + message.member.user.username + "! Your time of " + args[0] + " has been submitted. In this track's leaderboard, you are placed at **Rank " + rank + "**!");
          await message.channel.send(leaderEmbed);

        }else{
          //Error message for incorrect format
          message.channel.send('**DENIED:** The time you submit must be in the format of XX:XX:XX \n *(ex. 03:24:20, 06:79:10, 00:50:33)*');

        }
      }
    }
}