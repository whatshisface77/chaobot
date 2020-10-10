const Discord = require('discord.js');
var cron = require("cron");

const autoWinner = require("./auto/victory.js");
const autoNew = require("./auto/newtrack.js");

const client = new Discord.Client();

//Connecting to hosted mongodb database
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://root:fuckyou123@stats.nejt4.mongodb.net/test', {useNewUrlParser: true});

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

//Prefix used to call the bot's commands
const prefix = '!';

//Gets into other js files
const fs = require('fs');

client.commands = new Discord.Collection();

//Go into our commands folder, find all files that end with .js
const commandFiles = fs.readdirSync('./commands/').filter(file=>file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


//Happens once as the bot starts up (AKA void start)
client.once('ready', () => {
    //755571634747736072 My solo server
    //761740618531602453 SRB2K server totd-track
    console.log('Chao is online baybee');
});

//This is starting up the discord bot (AKA void Update)
client.on('message', message =>{
    //If you don't use a prefix, fuck off basically
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    //This allows for more complex commands to be made
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    //Advanced command handler
    if (!client.commands.has(command)) return;

    //Make sure the js files are the SAME NAME AS THE COMMAND
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

let scheduledMessageVictory = new cron.CronJob('00 00 09 * * *', () => {
    // This runs every day at 12:00:00am
    let channel = client.channels.cache.get();
    autoWinner.execute(channel);
  });

  let scheduledMessageNew = new cron.CronJob('00 00 10 * * *', () => {
    // This runs every day at 06:00:00am
    let channel = client.channels.cache.get();
    autoNew.execute(channel);
  });
  
  // When you want to start it, use:
  scheduledMessageVictory.start();
  scheduledMessageNew.start();

client.login(/*token*/);