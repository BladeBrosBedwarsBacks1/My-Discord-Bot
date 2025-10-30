const { SlashCommandBuilder } = require('discord.js');
const { getQuestion } = require('../utils/question.js');
const { updateWeaknesses } = require('../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maths')
        .setDescription('Get a maths revision question.')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Choose weaknesses or a fixed topic.')
                .setRequired(true)
                .addChoices(
                    { name: 'weaknesses', value: 'weaknesses' },
                    { name: 'fixed_topic', value: 'fixed_topic' }
                )),
    async execute(interaction) {
        const choice = interaction.options.getString('choice');
        const questionData = getQuestion('maths', choice, interaction.user.id);
        
        await interaction.reply({
            content: `**Maths Question (${questionData.topic.replace(/_/g, ' ').toUpperCase()}):**\n${questionData.q}\n`,
            ephemeral: false
        });

        const filter = m => m.author.id === interaction.user.id;
        try {
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const userAnswer = collected.first().content;
            const isCorrect = userAnswer.toLowerCase() === questionData.a.toLowerCase().replace(/\$/g, '');

            if (isCorrect) {
                await interaction.followUp('Correct!');
            } else {
                await interaction.followUp(`Incorrect. The correct answer was **${questionData.a}**`);
            }
            updateWeaknesses(interaction.user.id, 'maths', questionData.topic, isCorrect);
        } catch (e) {
            await interaction.followUp('Time has run out! The correct answer was **' + questionData.a + '**');
            updateWeaknesses(interaction.user.id, 'maths', questionData.topic, false);
        }
    },
};
