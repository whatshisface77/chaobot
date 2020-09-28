
const fs = require('fs');
const Discord = require('discord.js');

const stats = require("../models/stats.js");
const mongoose = require("mongoose");
const express = require("express");

//Connecting to MongoDB Collection
mongoose.connect('mongodb://localhost:27017/Stats');

const connection = mongoose.connection;

connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
  });


function findStats(options) {
    return new Promise((resolve, reject) => {
        return stats.find(options, function (err, result) {
            if (err) {
                return reject(err)
            }
            return resolve(result)
        })
    })
}

//Returns either the username or time from a given model in the collection
async function getData(field, value){
    
    try{
        const result = await findStats({});
        const data = result[value];

        if(field == "user"){
            return data.user;
        }else if (field == "time"){
            return data.time;
        }
        return 0;

    }catch(error){
        console.log("you suck!");
    }

}

//Converts any time in the format of xx:xx:xx into a single number, longer times mean larger numbers
async function convertTime(string){
    var fullNumberTime;
    var numArray;

    string = string + "";

    numArray = string.split(":");
    fullNumberTime = (parseInt(numArray[0]) * 60) + (parseInt(numArray[1])) + (parseInt(numArray[2]) * .01);
    return fullNumberTime;
}

async function buildString(){
    var string = "";
    var totalObj;
    var timeArray = [];
    var userArray = [];
    var stopSort = false;

    //Only used for getting the total amount of models in the collection
    await stats.find({}, function(err, result){
        if(err){
            result.send(err);
        }else{
            totalObj = result.length;
        }
    });

    //Obtaining data from the MongoDB collection
    for (i = 0;i < totalObj; i++){
        timeArray[i] = await getData('time', i);
        userArray[i] = await getData('user', i);
    }
    
    //Bubble sort algorithm used to rearrange array from shortest to longest time
    while(!stopSort){
        var keepSorting = false;
        for(i = 0; i < totalObj ; i++){
            var target = await convertTime(timeArray[i]);
            for(j = i + 1 ; j < totalObj ; j++){
                var comparison = await convertTime(timeArray[j]);
                if(target > comparison){

                    //Switch target time with comparison time so that the lower time is up front
                    var temp = timeArray[i];
                    timeArray[i] = timeArray[j];
                    timeArray[j] = temp;

                    //Then switch the users around so that the user always corresponds with their time
                    var userTemp = userArray[i];
                    userArray[i] = userArray[j];
                    userArray[j] = userTemp;

                    //The loop will continue if even a single switch is made
                    keepSorting = true;
                }
            }
        }

        if(!keepSorting){
            stopSort = true;
        }
    }

    //String building starts here
    var placeArray = [':first_place: **1st', ':second_place: **2nd', ':third_place: **3rd', '**4th', '**5th', '**6th', '**7th', '**8th', '**9th', '**10th'];
    for(i = 0; i < totalObj; i++){
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
            .setColor('#FF0000')
            .setTitle(":trophy: LEADERBOARD :trophy:")
            .setDescription(await buildString());

        await message.channel.send(leaderEmbed);
        
       }

       
  }
  

