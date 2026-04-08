import buttonHandler from './buttonHandler.js';
import modalHandler from './modalHandler.js';
import selectMenuHandler from './selectMenuHandler.js';

export default {
  name: 'interactionCreate',

  async execute(interaction, client) {
    try {
      if (interaction.user?.bot) return;

      // ========= COMMAND =========
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          return interaction.reply({
            content: '❌ Comando não encontrado!',
            ephemeral: true,
          });
        }

        await command.execute(interaction, client);
      }

      // ========= BUTTON =========
      else if (interaction.isButton()) {
        await buttonHandler.execute(interaction, client);
      }

      // ========= MODAL =========
      else if (interaction.isModalSubmit()) {
        await modalHandler.execute(interaction, client);
      }

      // ========= SELECT =========
      else if (
        interaction.isStringSelectMenu() ||
        interaction.isChannelSelectMenu() ||
        interaction.isRoleSelectMenu()
      ) {
        await selectMenuHandler.execute(interaction, client);
      }

    } catch (error) {
      console.error('❌ Erro global em interactionCreate:', error);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Erro inesperado.',
          ephemeral: true,
        });
      }
    }
  },
};