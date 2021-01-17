const strings = require("./strings.js");

let isSettingFormUp = false;

module.exports = {
	test: msg => {
		console.log("Test");
	},

	setup: msg => {
		if (!msg.guild) {
			msg.reply(strings.notInGuild);
			return;
		}

		const authorId = msg.author.id;

		const role = msg.guild.roles.cache.find(role => role.name === strings.adminRole);
		const guildMember = msg.guild.members.cache.find(member => member.id === authorId);

		const roleFromUser = guildMember.roles.cache.get(role.id);

		if (!roleFromUser) {
			msg.reply(strings.unknownRole);
			return;
		}

		if (isSettingFormUp) {
			msg.reply(strings.formSetupInProgress);
			return;
		}

		//appNewForm = [];
		isSettingFormUp = msg.author.id;

		msg.author.send(`Enter questions and enter \`$endsetup\` when done.`);
	}
};
