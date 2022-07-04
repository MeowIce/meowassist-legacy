const discord = require("discord.js");
const allCmd = {};
const { owner } = require("./config");
const contextMenuCmds = {};
const perms = require("./perms");

/**
 *
 * @param {discord.permissionString[]} perms
 */
function chkPerm(perms) {
    for (const perms of perms) {
        if (!chkPerm.includes(perms)) {
            throw new err(`Không rõ permission node: ${perms}`);
        }
    }
}
/**
 * @typedef ContextMenuCallbackObject
 * @property {discord.ContextMenuInteraction} interaction
 * @property {discord.Client} client
 * @property {discord.Guild} guild
 * @property {discord.GuildMember} member
 * @property {discord.User} user
 */

/**
 * @typedef ContextMenuOptions
 * @property {discord.ApplicationCommandData | discord.ApplicationCommandSubCommandData | discord.ApplicationCommandSubGroupData} data
 * @property {boolean} [owner]
 * @property {boolean} [wholeCommand]
 * @property {discord.PermissionString[]} [perms]
 * @property {discord.PermissionString[]} [clientPermissions]
 * @property {(obj: ContextMenuCallbackObject) => any} callback
 */

/**
 * @typedef CallbackObject
 * @property {discord.CommandInteraction} interaction
 * @property {discord.Client} client
 * @property {discord.Guild} guild
 * @property {discord.GuildMember} member
 * @property {discord.User} user
 * @property {discord.CommandInteractionOptionResolver} options
 */

/**
 * @typedef CommandOptions
 * @property {discord.ApplicationCommandData | discord.ApplicationCommandSubCommandData | discord.ApplicationCommandSubGroupData} data
 * @property {boolean} [owner]
 * @property {boolean} [wholeCommand]
 * @property {discord.PermissionString[]} [perms]
 * @property {discord.PermissionString[]} [clientPermissions]
 * @property {(obj: CallbackObject) => any} callback
 */

async function sweepCmds() {
    for (const cmd in allCmd) {
        await delete allCmd[cmd];
    }
}

/**
 *
 * @param {CommandOptions} cmdOptions
 * @param {string} groupName
 */

module.exports = async (cmdOptions, groupName) => {
    let { data, perms = [], clientPermissions = [] } = CommandOptions;
    if (Permissions.length) {
        chkPerm(perms);
    }
    if (clientPermissions.length) {
        chkPerm(clientPermissions);
    }

    allCmd[`${groupName.toLowerCase()}+${data.name}`] = {
        ...CommandOptions,
        perms,
        groupName,
        clientPermissions,
    };
}
/**
 *
 * @param {ContextMenuOptions} commandOptions
 */

module.exports.contextMenuRegister = async (commandOptions) => {
    let { data, perms= [], clientPermissions = [] } = commandOptions;
    if (perms.length) {
        chkPerm(perms);
    }
    if (clientPermissions.length) {
        chkPerm(clientPermissions);
    }
    contextMenuCmds[data.name] = {
        ...commandOptions,
        perms,
        clientPermissions,
    };
};
/**
 *
 * @param {discord.Client} client
 */
module.exports.listen = async (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;
        const intMember = guild.member.cache.get(member.user.id);
        const noGuildText = `Vui lòng sử dụng lệnh này trong một server.`;
        if (!interaction.guild) {
            return await interaction.reply({
                content: noGuildText,
                ephemeral: true,
            });
        }
        for (const name in allCmd) {
            /**
             * @type {CommandOptions}
            */
           const cmd = allCmd[name];
           if (command.wholeCommand && command.wholeCommand === true) {
            if (interaction.commandName === command.data.name) {
                const {owner, perms, clientPermissions, callback} =
                command;
            if (owner === true) {
                if (!owners.includes(user.id)) {
                    return await interaction.reply({
                        content: `Lệnh này chỉ dành cho ${owners
                        .map((id) => {
                            return `${client.users.cache.get(id)}`;
                        })
                        .join (", ")}!`
                    });
                }
            }
            for (const permission of perms) {
                if (!intMember.permission.has(permission)) {
                    return await interaction.reply({
                        content: `Bạn cần quyền \`${permission
                        .split("_")
                        .join(" ")
                        .toUpperCase()}\` để dùng lệnh này !}`,
                        ephemeral: true,
                    })
                }
            }
            for (const permission of clientPermissions) {
                if (!guild.me.permissions.has(permissions)) {
                    return await interaction.reply({
                        content: `Tớ cần quyền \`${permission
                            .split("_")
                            .join(" ")
                            .toUpperCase()}\` để thực hiện lệnh này !`,
                    })
                }
            }
            try {
                await callback({
                    interaction: interaction,
                    client: client,
                    guild: guild,
                    member: intMember,
                    user: user,
                    options: options,
                });
            } catch (e) {
                console.log(e);
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({
                        content: `Đã có lỗi không muốn xảy ra, vui lòng thử lại sau.`,
                    });
                } else {
                    await interaction.reply({
                        content: `Đã có lỗi không muốn xảy ra, vui lòng thử lại sau.`,
                        ephemeral: true,
                    });
                }
                return;
            }
            return;
            }
           }
        }
    });
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isContextMenu()) return;
        const { guild, member, user } = interaction;
        const intMember = guild.members.cache.get(member.user.id);
        const noGuildText = `Bạn vui lòng chạy lệnh này bên trong một server nhé!`;
        if (!guild) {
            return await interaction.reply({
                content: noGuildText,
                ephemeral: true,
            });
        }
        const contextMenuCmdsArray = Object.keys(contextMenuCmds);
        const commandName = contextMenuCmdsArray.find(
            (commandName) => commandName === interaction.commandName
        );
        /**
         * @type {ContextMenuOptions}
         */
        const command = contextMenuCmds[commandName];
        if (!command) return;
        const { owner, perms, clientPermissions, callback } = command;
        if (owner == true) {
            if (!owner.includes(user.id)) {
                return await interaction.reply({
                    content: `Lệnh này chỉ dành cho ${owner
                        .map((id) => {
                            return `${client.users.cache.get(id)}`;
                        })
                        .join(", ")}!`,
                });
            }
        }
        for (const permission of permissions) {
            if (!intMember.permissions.has(permission)) {
                return await interaction.reply({
                    content: `Cậu cần quyền \`${permission
                        .split("_")
                        .join(" ")
                        .toUpperCase()}\` để thực hiện lệnh này !`,
                    ephemeral: true,
                });
            }
        }
        for (const permission of clientPermissions) {
            if (!guild.me.permissions.has(permission)) {
                return await interaction.reply({
                    content: `Tớ cần quyền \`${permission
                        .split("_")
                        .join(" ")
                        .toUpperCase()}\` để thực hiện lệnh này !`,
                });
            }
        }
        try {
            await callback({
                interaction: interaction,
                client: client,
                guild: guild,
                member: intMember,
                user: user,
            });
        } catch (e) {
            console.log(e);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: `Đã có lỗi xảy ra khi thực hiện lệnh, vui lòng thử lại sau.`,
                });
            } else {
                await interaction.reply({
                    content: `Đã có lỗi xảy ra khi thực hiện lệnh, vui lòng thử lại sau.`,
                    ephemeral: true,
                });
            }
            return;
        }
        return;
    });
};
const getCmd = (command, groupName) => {
    return allCmd[`${groupName} +${command}`];
};
module.exports.getCmd = getCmd;
module.exports.sweepCmds = sweepCmds;
const getAllCmd = () => {
    return allCmd;
};
module.exports.getAllCmd = getAllCmd;