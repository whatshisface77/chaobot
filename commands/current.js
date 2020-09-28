const Discord = require('discord.js');
const fs = require('fs');

//Files that contain all of the track names and character names
const courseFile = require('../data/courses.js');
const charFile = require('../data/chars.js');

var today = new Date();

//Use these directories for finding the corresponding images
const courseDir = 'img/stages/';
const charDir = 'img/chars/';

var courseMax = 0; var charMax = 0;

//track.json is where the set variables for which track and character will be used are stored until the next day rotation
var trackData = require("../data/track.json");


module.exports = {
    name: 'current',
    description: "Lists the current track of the day!",
    
    async execute(message,args){

        var course = trackData.track;
        var char = trackData.character;

        //These will be set to -1 between the hours of 12:00am and 6:00am to prevent track usage during this time
        if(course == -1 || char == -1){

            message.channel.send("There is no current Track of the Day, please await any further messages regarding information about the next Track.");

        }else{

            //Generate course
            await fs.readdir(courseDir, async (err, files)=>{
                courseMax = files.length;
                const stageEmbed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle(courseFile.courseArray[course])
                .setAuthor('Track of the Day ' + (today.getMonth() + 1) +'/' + today.getDate() + '/' + today.getFullYear(), 'https://i.imgur.com/wSTFkRM.png')
                .attachFiles(['img/stages/MAP' + course + 'P.png'])
                .setImage('attachment://MAP' + course + 'P.png')
                await message.channel.send(stageEmbed);
                });
                
            //Generate Character
            await fs.readdir(charDir, async (err, files)=>{
                charMax = files.length;
                const charEmbed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('Character: ' + charFile.charArray[char])
                .attachFiles(['img/chars/' + char + '.png'])
                .setThumbnail('attachment://' + char + '.png')
                /*.setTimestamp()
                .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');*/
                await message.channel.send(charEmbed);
                });
        }
    }
}

