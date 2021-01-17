const strings = require("./strings.js");

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
/*
		msg.guild.members.fetch(authorId).then(user => {
			console.log(user.roles);
		}).catch(e => {
			console.error(e);
		});
*/

		const roleFromUser = guildMember.roles.cache.get(role.id);

		if (!roleFromUser) {
			msg.reply(strings.unknownRole);
			return;
		}

		/*if (isSettingFormUp) {
			msg.reply("Someone else is already configuring the form.");
			return;
		}*/
/*
		appNewForm = [];
		isSettingFormUp = msg.author.id;
*/
		msg.author.send(`Enter questions and enter \`$endsetup\` when done.`);
	}
};
