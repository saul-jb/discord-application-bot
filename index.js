// https://discordapp.com/oauth2/authorize?client_id=479944525943537665&scope=bot&permissions=268528647

const Discord = require('discord.js');
const auth = require("./auth.json");

const client = new Discord.Client();
const botChar = "$";

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content.charAt(0) === botChar) {
		msg.reply('Pong!');
	}
});

client.login(auth.token);
