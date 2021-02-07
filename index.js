// https://discordapp.com/oauth2/authorize?client_id=479944525943537665&scope=bot&permissions=268528647

const Discord = require('discord.js');
const auth = require("./auth.json");
const activationStrings = require("./activation-strings.js");
const actions = require("./actions.js");
const strings = require("./strings.js")

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
})

client.on('message', msg => {
	let hasRanCommand = false;

	activationStrings.forEach(str => {
		const strLen = str.length;

		if (msg.content.substr(0, strLen) === str) {
			const command = msg.content.substr(strLen);

			hasRanCommand = true;

			if (!actions[command])
				msg.reply(strings.unknownCommand);

			try {
				actions[command](msg);
			} catch (e) {
				msg.reply(strings.error);
				console.error(e);
			}
		}
	});

	if (!hasRanCommand && msg.channel.type === "dm") {
		try {
			actions.directMessage(msg);
		} catch (e) {
			msg.reply(strings.error);
			console.error(e);
		}
	}
});

client.login(auth.token);
