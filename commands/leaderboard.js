const Discord = require('discord.js');

const sort = require("../js/sort.js");
const findData = require("../js/find.js");

//Used for searching through the database for times, sorting times, and displaying them in a leaderboard style
async function buildString(){
    var string = "";
    var timeArray = [];
    var userArray = [];

    var timeArray = await sort.timeSort();

    //Find the particular user for every time value in the time array
    for(i = 0; i < timeArray.length; i++){

        try{
            var fullResult;
            const result = await findData.stats({time: timeArray[i]});
            for(j = 0; j < result.length; j++){
                if(result[j].time == timeArray[i]){
                    fullResult = result[j];
                    userArray[i] = fullResult.user;
                    break;
                }
            }

            

        }catch(error){
            console.log("you suck!");
        }

    }

    console.log(userArray);

    //String building starts here
    var placeArray = [':first_place: **1st', ':second_place: **2nd', ':third_place: **3rd', '**4th', '**5th', '**6th', '**7th', '**8th', '**9th', '**10th'];
    for(i = 0; i < timeArray.length; i++){
        string = await string.concat(placeArray[i] + ": " + userArray[i] + "** - " + timeArray[i] + " \n\n");
    }


    //console.log("This String:" + string);
    return string;
}


//Send the embedded message
module.exports = {
      name: 'leaderboard',
      description: "Lists the leaderboard, ranking the players of the 'track of the day' by time!",
         
       async execute(message,args){

        const leaderEmbed = new Discord.MessageEmbed()
            .setColor('#ffa500')
            .setTitle(":trophy: LEADERBOARD :trophy:")
            .setDescription(await buildString());

        await message.channel.send(leaderEmbed);
        
       }

       
  }
  

