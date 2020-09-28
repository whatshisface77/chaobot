const Discord = require('discord.js');
const fs = require('fs');
const findData = require("../js/find.js");
const sort = require("../js/sort.js");

var fileName = "../data/track.json";
var trackData = require(fileName);

const stats = require("../models/stats.js");

//Sorts all times, finds the user at the top of the leaderboard
async function findWinner(){
    var trackWinner;
    var timeArray = await sort.timeSort();

    try{
        const result = await findData.stats({time: timeArray[0]});
        for(i = 0; i < result.length; i++){
            if(result[i].time == timeArray[0]){
                fullResult = result[i];
                break;
            }
        }
        trackWinner = fullResult.user;
    }catch(error){
        console.log("you suck!");
    }

    return trackWinner;
}

//When the track of the day ends, the old track is deleted and is replaced at 6:00am the next day
async function eraseTrack(){
    trackData.track = -1;
    trackData.character = -1;

    fs.writeFile("data/track.json", JSON.stringify(trackData), function writeJSON(err){
        if (err) return console.log(err);
    });
}

async function wipeLeaderboard(){
    stats.collection.drop();
}

module.exports = {

    async execute(channel){
        var winner = await findWinner();
        eraseTrack();
        wipeLeaderboard();

        const winnerEmbed = new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle("The Winner of The Track of the Day is:\n\n:tada: ***" + winner + "*** :tada:")
            .setDescription("The next Track of the Day will begin at 6:00am, where the track and character will be revealed!")
            channel.send(winnerEmbed);
    }
}