const { SlashCommandBuilder } = require('discord.js');
const { getUser, updateUser } = require('../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Change your settings.')
        .addIntegerOption(option =>
            option.setName('year_group')
                .setDescription('')
                .setRequired(true)),
    async execute(interaction) {
        const yearGroup = interaction.options.getInteger('year_group');
        const user = getUser(interaction.user.id);
        user.year_group = yearGroup;
        updateUser(interaction.user.id, user);

        await interaction.reply({
            content: `Your year group has been set to ${yearGroup}.`,
            ephemeral: true
        });
    },
};
