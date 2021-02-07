const strings = require("./strings.js");
const activationStrings = require("./activation-strings.js");

let applicationQuestions = require("./application-questions.js");

let isSettingFormUp = false;
let appNewForm = [];
let usersApplicationStatus = [];
let userToSubmitApplicationsTo = null;

const authorAuthorization = msg => {
	const authorId = msg.author.id;

	const role = msg.guild.roles.cache.find(role => role.name.toLowerCase() === strings.adminRole.toLowerCase());

	const guildMember = msg.guild.members.cache.find(member => member.id === authorId);

	if (!role) {
		msg.reply(strings.unknownRole);
		return false;
	}

	const roleFromUser = guildMember.roles.cache.get(role.id);

	if (!roleFromUser) {
		msg.reply(strings.notAuth);
		return false;
	}

	return true;
};

const applicationFormCompleted = (data) => {
	let i = 0, answers = "";

	for (; i < applicationQuestions.length; i++) {
		answers += `${applicationQuestions[i]}: ${data.answers[i]}\n`;
	}

	if (userToSubmitApplicationsTo) {
		const userSubmitString = strings.formReceiveMessage({
			user: data.user.username,
			botChar: activationStrings[0]
		});

		userToSubmitApplicationsTo.send(`${userSubmitString}\n${answers}`);
	}
};

const cancelUserApplicationForm = (msg, isRedo = false) => {
	const user = usersApplicationStatus.find(user => user.id === msg.author.id);

	if (user) {
		usersApplicationStatus = usersApplicationStatus.filter(el => el.id !== user.id)
		msg.reply(strings.applicationCancel);
	} else if (!isRedo) {
		msg.reply(strings.applicationFormFalseCancel);
	}
};

const sendUserApplyForm = msg => {
	const user = usersApplicationStatus.find(user => user.id === msg.author.id);

	if (!user) {
		const userApplyString = strings.formApplyMessage({
			user: msg.author.username,
			botChar: activationStrings[0]
		});

		msg.author.send(userApplyString);
		msg.author.send(applicationQuestions[0]);
		usersApplicationStatus.push({id: msg.author.id, currentStep: 0, answers: [], user: msg.author});
	} else {
		msg.author.send(applicationQuestions[user.currentStep]);
	}
};

module.exports = {
	directMessage: msg => {
		if (msg.author.id === isSettingFormUp) {
			appNewForm.push(msg.content);
		} else {
			const user = usersApplicationStatus.find(user => user.id === msg.author.id);

			if (user && msg.content) {
				user.answers.push(msg.content);
				user.currentStep++;

				if (user.currentStep >= applicationQuestions.length) {
					usersApplicationStatus = usersApplicationStatus.filter(item => item.id != user.id);

					if (!userToSubmitApplicationsTo) {
						msg.author.send(strings.submissionsNotSet);
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

		const adminSetupString = strings.formSetupMessage({
			user: msg.author.username,
			botChar: activationStrings[0]
		});

		msg.author.send(adminSetupString);
	},

	endsetup: msg => {
		if (isSettingFormUp !== msg.author.id) {
			msg.reply(strings.formSetupInProgress);
			return;
		}

		applicationQuestions = appNewForm;

		isSettingFormUp = false;
		appNewForm = [];

		msg.reply(strings.newFormSetup);
	},

	setsubmissions: msg => {
		if (!msg.guild) {
			msg.reply(strings.notInGuild);
			return;
		}

		if (!authorAuthorization(msg))
			return;

		userToSubmitApplicationsTo = msg.author;

		msg.reply(strings.setSubmissionsReply);
	},

	setsubmissionschannel: msg => {
		if (!msg.guild) {
			msg.reply(strings.notInGuild);
			return;
		}

		if (!authorAuthorization(msg))
			return;

		userToSubmitApplicationsTo = msg.channel;

		msg.reply(strings.setSubmissionsChannelReply);
	},

	apply: msg => {
		sendUserApplyForm(msg);
	},

	cancel: msg => {
		cancelUserApplicationForm(msg);
	},

	redo: msg => {
		cancelUserApplicationForm(msg, true);
		sendUserApplyForm(msg);
	}
};
