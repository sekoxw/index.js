const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    PermissionsBitField
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Command prefix
const PREFIX = '!';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.content.startsWith(`${PREFIX}roleinfo`)) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply(':x: You don\'t have permission to use this command.');
        }

        const args = message.content.split(' ');
        const roleId = args[1];

        if (!roleId) {
            return message.reply(':x: Please specify a role ID.');
        }

        const role = message.guild.roles.cache.get(roleId);
        if (!role) {
            return message.reply(':x: Role not found. Make sure you provided the correct ID.');
        }

        // Fetch all members to ensure accurate data
        try {
            await message.guild.members.fetch();
        } catch (error) {
            console.error('Failed to fetch members:', error);
            return message.reply(':x: An error occurred while fetching guild members.');
        }

        const members = role.members.map(member => ({
            username: member.user.username,
            mention: member.toString(),
            id: member.id
        }));

        if (members.length === 0) {
            return message.reply(`:x: No members found in the role **${role.name}**.`);
        }

        const membersPerPage = 10;
        const totalPages = Math.ceil(members.length / membersPerPage);
        let currentPage = 1;

        const generateEmbed = (page) => {
            const start = (page - 1) * membersPerPage;
            const end = start + membersPerPage;
            const membersList = members.slice(start, end)
                .map((m, index) => `${start + index + 1}. **${m.username}** (${m.mention}) - ID: \`${m.id}\``) // Add index + 1 to number the members
                .join('\n');
            return new EmbedBuilder()
                .setColor(role.color || 0x0099ff)
                .setTitle(`Members of Role: ${role.name}`)
                .setDescription(membersList)
                .setFooter({ text: `Page ${page} of ${totalPages} | Total Members: ${members.length}` });
        };
        const generateButtons = (page) => new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === totalPages),
                new ButtonBuilder()
                    .setCustomId('end')
                    .setLabel('End')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(page === totalPages),
                new ButtonBuilder()
                    .setCustomId('mid')
                    .setLabel('Mid')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(totalPages <= 2)
            );

        // Send the initial message with embed and buttons
        const messageEmbed = await message.channel.send({
            embeds: [generateEmbed(currentPage)],
            components: [generateButtons(currentPage)]
        });

        // Create the interaction collector
        const collector = messageEmbed.createMessageComponentCollector({ max: totalPages }); // Add this line
        collector.on('collect', async (interaction) => {
            try {
                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({ content: ':x: This button is not for you.', ephemeral: true });
                }
                // Debugging: Log which button was clicked
                console.log(`Interaction detected: ${interaction.customId}`);
                // Handle button interactions
                if (interaction.customId === 'prev') {
                    currentPage = Math.max(currentPage - 1, 1);
                } else if (interaction.customId === 'next') {
                    currentPage = Math.min(currentPage + 1, totalPages);
                } else if (interaction.customId === 'end') {
                    currentPage = totalPages;
                } else if (interaction.customId === 'mid') {
                    currentPage = Math.ceil(totalPages / 2);
                }
                // Rebuild the message with updated embed and buttons
                await messageEmbed.edit({
                    embeds: [generateEmbed(currentPage)],
                    components: [generateButtons(currentPage)]
                });
                // Acknowledge the interaction
                await interaction.deferUpdate();
            } catch (error) {
                console.error('Error handling interaction:', error);
                await interaction.reply({ content: ':x: An error occurred.', ephemeral: true });
            }
        });
    }
});





// تسجيل الدخول




// تسجيل الدخول





// تسجيل الدخول
client.login('MTAxODEyNDkyMTcxODcxODUyNA.Gzo2Sj.eO8a9RqYaPM8HDODzYeR0RJv0kxbBAILFJtUWE');





