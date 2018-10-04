// https://discordapp.com/oauth2/authorize?client_id=479944525943537665&scope=bot&permissions=268528647

const Discord = require('discord.js');
const auth = require("./auth.json");
const applicationQuestions = require("./application-questions.js");

const client = new Discord.Client();
const botChar = "$";
let usersApplicationStatus = [];

const applicationFormCompleted = (data) => {
	console.log(data);
}

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
	} else if (!msg.guild) {
		msg.reply("This command can only be used in a guild.");
	} else {
		msg.reply("Please specify a role.");
	}
}

const sendUserApplyForm = msg => {
	const user = usersApplicationStatus.find(user => user.id === msg.author.id);

	if (!user) {
		msg.author.send(`Application commands: '${botChar}cancel', '${botChar}redo'`);
		msg.author.send(applicationQuestions[0]);

		usersApplicationStatus.push({id: msg.author.id, currentStep: 0, answers: []});
	} else {
		msg.author.send(applicationQuestions[user.currentStep]);
	}
}

const cancelUserApplicationForm = (msg, isRedo = false) => {
	const user = usersApplicationStatus.find(user => user.id === msg.author.id);

	if (user) {
		usersApplicationStatus = usersApplicationStatus.filter(el => el.id !== user.id)
		msg.reply("Application canceled.");
	} else if (!isRedo) {
		msg.reply("You have not started an application form yet.");
	}
};

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
			case "cancel":
				cancelUserApplicationForm(msg);
				break;
			case "redo":
				cancelUserApplicationForm(msg, true);
				sendUserApplyForm(msg);
				break;
			default:
				msg.reply("I do not know this command.");
		}
	} else {
		if (msg.channel.type === "dm") {
			const user = usersApplicationStatus.find(user => user.id === msg.author.id);

			if (user) {
				user.answers.push(msg.content);
				user.currentStep++;

				if (user.currentStep >= applicationQuestions.length) {
					applicationFormCompleted(user);
					msg.author.send("Congradulations your application has been sent!");
				} else {
					msg.author.send(applicationQuestions[user.currentStep]);
				}
			}
		}
	}
});

client.login(auth.token);
