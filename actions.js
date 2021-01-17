const strings = require("./strings.js");

let isSettingFormUp = false;
let appNewForm = [];
let usersApplicationStatus = [];

const authorAuthorization = msg => {
	const authorId = msg.author.id;

	const role = msg.guild.roles.cache.find(role => role.name === strings.adminRole);
	const guildMember = msg.guild.members.cache.find(member => member.id === authorId);

	const roleFromUser = guildMember.roles.cache.get(role.id);

	if (!role) {
		msg.reply(strings.unknownRole);
		return false;
	}

	if (!roleFromUser) {
		msg.reply(strings.notAuth);
		return false;
	}

	return true;
};

module.exports = {
	test: msg => {
		console.log("Test");
	},

	directMessage: msg => {
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
					msg.author.send(strings.applicationSent);
				} else {
					msg.author.send(applicationQuestions[user.currentStep]);
				}
			}
		}
	},

	setup: msg => {
		if (!msg.guild) {
			msg.reply(strings.notInGuild);
			return;
		}

		if (!authorAuthorization(msg))
			return;

		if (isSettingFormUp) {
			msg.reply(strings.formSetupInProgress);
			return;
		}

		appNewForm = [];
		isSettingFormUp = msg.author.id;

		msg.author.send(`Enter questions and enter \`$endsetup\` when done.`);
	},

	endsetup: msg => {
		if (isSettingFormUp !== msg.author.id) {
			msg.reply(strings.formSetupInProgress);
			return;
		}

		isSettingFormUp = false;
		applicationQuestions = appNewForm;
	}
};
