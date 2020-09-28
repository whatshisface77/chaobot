const Discord = require('discord.js');

const stats = require("../models/stats.js");
const findData = require("../js/find.js");
const mongoose = require("mongoose");

module.exports = {
    data: async function getData(field, value){
    
        try{
            const result = await findData.stats({});
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
    
    },

    convert: async function convertTime(string){
        var fullNumberTime;
        var numArray;
    
        string = string + "";
    
        numArray = string.split(":");
        fullNumberTime = (parseInt(numArray[0]) * 60) + (parseInt(numArray[1])) + (parseInt(numArray[2]) * .01);
        return fullNumberTime;
    }
}