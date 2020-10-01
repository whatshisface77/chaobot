
const Discord = require('discord.js');

const stats = require("../models/stats.js");
const dataManage = require("../js/data.js");
const findData = require("../js/find.js");
const mongoose = require("mongoose");

module.exports = {

    timeSort: async function sortTime(){
        var totalObj;
        var timeArray = [];
        var stopSort = false;

        //Only used for getting the total amount of models in the collection
        try{
            const result = await findData.stats({});
            totalObj = result.length;
        }catch(error){
            console.log("you suck!");
        }

        //Obtaining data from the MongoDB collection
        for (i = 0;i < totalObj; i++){
            timeArray[i] = await dataManage.data('time', i);
        }
        
        //Bubble sort algorithm used to rearrange array from shortest to longest time
        while(!stopSort){
            var keepSorting = false;
            for(i = 0; i < totalObj ; i++){
                var target = await dataManage.convert(timeArray[i]);
                for(j = i + 1 ; j < totalObj ; j++){
                    var comparison = await dataManage.convert(timeArray[j]);
                    if(target > comparison){

                        //Switch target time with comparison time so that the lower time is up front
                        var temp = timeArray[i];
                        timeArray[i] = timeArray[j];
                        timeArray[j] = temp;

                        //The loop will continue if even a single switch is made
                        keepSorting = true;
                    }
                }
            }

            if(!keepSorting){
                stopSort = true;
            }
        }

        return timeArray;
    }

}