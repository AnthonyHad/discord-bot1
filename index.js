// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// attaching or client to commands allows us to access commands in other folders
client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

//listening to commands

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }

  // if (commandName === 'ping') {
  //   await interaction.reply('Pong!');
  // } else if (commandName === 'server') {
  //   await interaction.reply(
  //     `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
  //   );
  // } else if (commandName === 'user') {
  //   await interaction.reply(
  //     `Your Tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
  //   );
  // }
});

// Login to Discord with your client's token
client.login(token);
