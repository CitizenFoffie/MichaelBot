// Require the necessary discord.js classes
const { Client, Intents, DiscordAPIError } = require('discord.js');
const DiscordJS = require('discord.js')
const info = require('./config.json');
const axios = require('axios').default;
const {google} = require('googleapis');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const paywallcommand = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .addBooleanOption(option =>
        option.setName('scihub')
        .setDescription('Use if it is a academic study or article.')
        .setRequired(false))
	.addStringOption(option =>
        option.setName('url')
        .setDescription('URL of the website')
        .setRequired(true));

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
    const guildId = '970332950661062767' // TODO: change it to be global commands somehow
    const guild = client.guilds.cache.get(guildId)
    let commands1
    if (guild) {
        commands1 = guild.commands
    } else {
        commands1 = Routes.applicationCommands(info.clientid)
    }
    
    commands1.create({ //command handeller?!?!?
        name: 'ping',
        description: 'replies with pong'
    })
    commands1.create({
        name: 'httpget',
        description: 'gets a API request',
        options: [{
            name: "url",
            description: "URL of the thing you want to request to",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ]
    })
    /*
    commands.create({
        name: 'paywall',
        description:'bypasses paywalls',
        options: [{
            name: "url",
            description: "URL of the thing you want to request to",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },{
            name: 'scihub',
            description: 'for academic stuff use this',
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.BOOLEAN
        }]
    })*/
});
client.on('interactionCreate', interaction => {
    if (!interaction.isCommand()) return;
    const { commandName, options } = interaction;
    if (commandName === "ping") {
        interaction.reply({
            content: 'pong',
            //ephemeral:true
        })
    }
    else if (commandName === 'httpget') {
        let text = options.getString('url')
            axios.get(text).then(resp => { 
                const contenttotext = JSON.stringify(resp.data)
                interaction.reply({
                content: contenttotext    
                 })
        }) .catch(function (error) {
            // handle error
          });
    }
    else if ( commandName === 'paywall') { //TODO: make this work
        let text = options.getString('url')
        let scihub = options.getBoolean('scihub')
        let reply = 'https://12ft.io/'+text
        if (scihub === false && scihub) {
            reply = 'https://12ft.io/'+text
        } else if (scihub === true){
            reply = 'https://sci-hub.hkvisa.net/'+text
        }
        interaction.reply({
            content: reply
        })
    };
});
// Login to Discord with your client's token
client.login(info.token);