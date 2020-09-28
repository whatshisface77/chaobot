const Discord = require('discord.js');
const fs = require('fs');
const findData = require("../js/find.js");
const sort = require("../js/sort.js");

var fileName = "../data/track.json";
var trackData = require(fileName);

//Files that contain all of the track names and character names
const courseFile = require('../data/courses.js');
const charFile = require('../data/chars.js');

//Use these directories for finding the corresponding images
const courseDir = 'img/stages/';
const charDir = 'img/chars/';

var today = new Date();


//When this message activates, it sets a brand new course and character for the track that will persist until 12:00am
async function setNewTrack(){
    
    trackData.track = Math.floor(Math.random() * courseFile.courseArray.length-1);
    trackData.character = Math.floor(Math.random() * charFile.charArray.length-1);

    fs.writeFile("data/track.json", JSON.stringify(trackData), function writeJSON(err){
        if (err) return console.log(err);
    });
}

module.exports = {

    async execute(channel){
        await setNewTrack();

        const winnerEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle("Welcome to today's new Track of the Day!")
            .setDescription("You have until 11:59pm tonight to get the best time using this course and character:")
            channel.send(winnerEmbed);

            //Generate course

            var course = trackData.track;
            var char = trackData.character;

            await fs.readdir(courseDir, async (err, files)=>{
                const stageEmbed = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTitle(courseFile.courseArray[course])
                .setAuthor('Track of the Day ' + (today.getMonth() + 1) +'/' + today.getDate() + '/' + today.getFullYear(), 'https://i.imgur.com/wSTFkRM.png')
                .attachFiles(['img/stages/MAP' + course + 'P.png'])
                .setImage('attachment://MAP' + course + 'P.png')
                await channel.send(stageEmbed);
                });
                
            //Generate Character
            await fs.readdir(charDir, async (err, files)=>{
                const charEmbed = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTitle('Character: ' + charFile.charArray[char])
                .attachFiles(['img/chars/' + char + '.png'])
                .setThumbnail('attachment://' + char + '.png')
                await channel.send(charEmbed);
                });
    }
}