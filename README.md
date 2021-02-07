# discord-application-bot
A simple application bot for discord that allows admins to create application forms for the user to complete.

## Usage

### Running
1. Create a file in this directory called "auth.json" and put in it "{"token": "YOUR-AUTH-TOKEN"}"
2. Run with `npm run bot`

### Server Setup
1. Add the role `Admin` and add this role to the admins.
2. Message `$setsubmissions` in your server to tell the bot to submit to you (or alternatively use the `$setsubmissionschannel` command).
3. Message `$setup` to configure the application form.
4. Message `$endsetup` to finish.

### Applying
End users need to run `$apply` to start an application.

## Customising

### Command Symbol
To add or change the symbol (or string) that goes before the command edit `activation-strings.js` and add or remove strings from the array.

### Messages
To change what the bot says change the appropriate text in `strings.js`

### Default Questions
To change the default application questions that are set when the bot starts up edit the `application-questions.js` file.

### Extending Functionality
To add a command to this bot add a function to the `module.exports` object in `actions.js`.<br>
The function needs to be named the command you want it to listen for and it will call that with the message passed as a parameter.
