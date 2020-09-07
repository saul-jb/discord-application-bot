// https://discordapp.com/oauth2/authorize?client_id=479944525943537665&scope=bot&permissions=268528647

const Discord = require('discord.js');
const auth = require("./auth.json");
let applicationQuestions = require("./application-questions.js");

const client = new Discord.Client();
const botChar = "$";
let usersApplicationStatus = [];
let appNewForm = [];
let isSettingFormUp = false;
let userToSubmitApplicationsTo = null;

const applicationFormCompleted = (data) => {
	let i = 0, answers = "";

	for (; i < applicationQuestions.length; i++) {
		answers += `${applicationQuestions[i]}: ${data.answers[i]}\n`;
	}

	if (userToSubmitApplicationsTo)
		userToSubmitApplicationsTo.send(`${data.user.username} has submitted a form.\n${answers}`);
};

const addUserToRole = (msg, roleName) => {
	if (roleName === "Admin") {
		msg.reply("Stop trying to commit mutiny.")
		return;
	}

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
};

const sendUserApplyForm = msg => {
	const user = usersApplicationStatus.find(user => user.id === msg.author.id);

	if (!user) {
		msg.author.send(`Application commands: \`\`\`${botChar}cancel, ${botChar}redo\`\`\``);
		msg.author.send(applicationQuestions[0]);
		usersApplicationStatus.push({id: msg.author.id, currentStep: 0, answers: [], user: msg.author});
	} else {
		msg.author.send(applicationQuestions[user.currentStep]);
	}
};

const cancelUserApplicationForm = (msg, isRedo = false) => {
	const user = usersApplicationStatus.find(user => user.id === msg.author.id);

	if (user) {
		usersApplicationStatus = usersApplicationStatus.filter(el => el.id !== user.id)
		msg.reply("Application canceled.");
	} else if (!isRedo) {
		msg.reply("You have not started an application form yet.");
	}
};

const applicationFormSetup = (msg) => {
	if (!msg.guild) {
		msg.reply("This command can only be used in a guild.");
		return;
	}

	if (!msg.member.roles.find("name", "Admin")) {
		msg.reply("This command can only be used by an admin.");
		return;
	}

	if (isSettingFormUp) {
		msg.reply("Someone else is already configuring the form.");
		return;
	}

	appNewForm = [];
	isSettingFormUp = msg.author.id;

	msg.author.send(`Enter questions and enter \`${botChar}endsetup\` when done.`);
};

const endApplicationFormSetup = (msg) => {
	if (isSettingFormUp !== msg.author.id) {
		msg.reply("You are not the one setting the form up.");
		return;
	}

	isSettingFormUp = false;
	applicationQuestions = appNewForm;
};

const setApplicationSubmissions = (msg) => {
	if (!msg.guild) {
		msg.reply("This command can only be used in a guild.");
		return;
	}

	if (!msg.member.roles.find("name", "Admin")) {
		msg.reply("Only admins can do this.")
		return;
	}

	userToSubmitApplicationsTo = msg.author;
	msg.reply("Form submissions will now be sent to you.")
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

		switch (command.toLowerCase()) {
			case "apply":
				sendUserApplyForm(msg);
				break;
			case "addrole":
				addUserToRole(msg, parameters.join(" "));
				break;
			case "cancel":
				cancelUserApplicationForm(msg);
				break;
			case "redo":
				cancelUserApplicationForm(msg, true);
				sendUserApplyForm(msg);
				break;
			case "setup":
				applicationFormSetup(msg);
				break;
			case "endsetup":
				endApplicationFormSetup(msg);
				break;
			case "setsubmissions":
				setApplicationSubmissions(msg);
				break;
			case "help":
				msg.reply(`Available commands: \`\`\`${botChar}apply, ${botChar}addrole, ${botChar}setup, ${botChar}endsetup, ${botChar}setsubmissions, ${botChar}help\`\`\``);
				break;
			default:
				msg.reply("I do not know this command.");
		}
	} else {
		if (msg.channel.type === "dm") {
			if (msg.author.id === isSettingFormUp) {
				appNewForm.push(msg.content);
			} else {
				const user = usersApplicationStatus.find(user => user.id === msg.author.id);

				if (user && msg.content) {
					user.answers.push(msg.content);
					user.currentStep++;

					if (user.currentStep >= applicationQuestions.length) {
						if (!userToSubmitApplicationsTo) {
							msg.author.send("The server admin has not configured $setsubmissions.");
							return;
						}
						applicationFormCompleted(user);
						msg.author.send("Congratulations your application has been sent!");
					} else {
						msg.author.send(applicationQuestions[user.currentStep]);
					}
				}
			}
		}
	}
});

client.login(auth.token);
