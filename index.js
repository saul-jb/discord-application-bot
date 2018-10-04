// https://discordapp.com/oauth2/authorize?client_id=479944525943537665&scope=bot&permissions=268528647

const Discord = require('discord.js');
const auth = require("./auth.json");

const client = new Discord.Client();
const botChar = "$";

const addUserToRole = (msg, parameters) => {
	const roleName = parameters[0];

	if (roleName && msg.guild) {
		const role = msg.guild.roles.find("name", roleName);

		if (role) {
			msg.member.addRole(role);

			msg.reply(`Added you to role: '${roleName}'`);
		} else {
			msg.reply(`Role '${roleName}' does not exist.`);
		}
	} else {
		msg.reply("Please specify a role.");
	}
}

const sendUserApplyForm = (msg) => {
	msg.author.send("test");
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content.charAt(0) === botChar) {
		const request = msg.content.substr(1);
		let command, parameters = [];

		if (request.indexOf(" ") !== -1) {
			command = request.substr(0, request.indexOf(" "));
			parameters = request.split(" ");
			parameters.shift();
		} else {
			command = request;
		}

		switch (command) {
			case "apply":
				sendUserApplyForm(msg);
				break;
			case "addRole":
				addUserToRole(msg, parameters);
				break;
			default:
				msg.reply("I do not know this command");
		}
	}
});

client.login(auth.token);
