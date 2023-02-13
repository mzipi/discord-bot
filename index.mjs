import 'dotenv/config';
import fetch from 'node-fetch';
import express from 'express';
import {
	verifyKeyMiddleware,
	InteractionResponseType,
	InteractionType,
	MessageComponentTypes,
	ButtonStyleTypes,
	TextStyleTypes
} from 'discord-interactions';

const app = express();
const PORT = process.env.PORT || 3000;

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {

	const { type, id, data, member } = req.body;

	if (type === InteractionType.APPLICATION_COMMAND) {

		const { name } = data;

		if (data.resolved) {

			const { resolved } = data
			
			if (resolved.members) {
				res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: 'Interactuaste con un usuario'
					}
				})
			}
	
			if (resolved.messages) {
				res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: 'Interactuaste con un mensaje'
					}
				})
			}
		}

		if (name === 'help') {

			const data = await getCommands();
			const commands = await data.json();
			const commandsFiltered = commands.filter((command) => command.type === 1);
			const commandsArray = commandsFiltered.map(command => command.name);
			const commandsString = commandsArray.join('\n\t- ');
	
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: `Los comandos disponibles son:\n\t- ${commandsString}`
				}
			});
		} 
		
		if (name === 'modal') {
			return res.send({
				type: InteractionResponseType.MODAL,
				data: {
					title: 'Input modal',
					custom_id: 57546546,
					components: [
						{
							type: MessageComponentTypes.ACTION_ROW,
							components: [
								{
									type: MessageComponentTypes.INPUT_TEXT,
									custom_id: 3324235,
									label: "Name",
									style: TextStyleTypes.SHORT
								}
							]
						}
					]
				}
			});
		}
	
		if (name === 'button') {
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					components: [
						{
							type: MessageComponentTypes.ACTION_ROW,
							components: [
								{
									type: MessageComponentTypes.BUTTON,
									style: ButtonStyleTypes.SUCCESS,
									label: 'Accept',
									custom_id: 'accept_button'
								}
							]
						}
					]
				}
			})
		}

		if (name === 'roles') {
			res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: 'Selecciona un rol',
					components: [
						{
							type: MessageComponentTypes.ACTION_ROW,
							components: [
								{
									type: MessageComponentTypes.ROLE_SELECT,
									custom_id: 'roleMenuId',
								}
							]
						}
					]
				}
			})
		}

		if (name === 'menu') {
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: "Elije una opción",
					components: [
						{
							type: MessageComponentTypes.ACTION_ROW,
							components: [
								{
									type: MessageComponentTypes.STRING_SELECT,
									custom_id: 23254626,
									options: [
										{
											label: 'label 1',
											value: 'value 1',
											description: 'description 1'
										},
										{
											label: 'label 2',
											value: 'value 2',
											description: 'description 2'
										}
									]
								}
							]
						}
					]
				}
			})
		}

		if (name === 'compuesto') {
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: { content: `Comando: ${name}` }
			});
		}

		if (name === 'opciones') {
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: { content: `Comando: ${name}` }
			});
		}
	
		if (!req.body.data.name) {
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: { content: 'No existe ese comando' }
			});
		}
	}

	if (type === InteractionType.MESSAGE_COMPONENT) {

		if (data.custom_id === 'roleMenuId') {
			const selectedRole = await data.values;
			const { user } = member;
			const memberInfo = await getMemberInfo(user);
			const memberInfoJson = await memberInfo.json();
			const roles = memberInfoJson.roles;

			const role = roles.filter(n => n === selectedRole[0]);

			if (role.length === 0) {
				await setRole(user, selectedRole);
				res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: 'Role added'
					}
				});
			} else {
				res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: 'Role already exist'
					}
				});
			}
		}
	}
	
	if (type === InteractionType.MODAL_SUBMIT) {
		console.log('InteractionType.MODAL_SUBMIT');
	}
});

app.listen(PORT, () => console.log('Running...'));

async function getCommands() {
	const url = `https://discord.com/api/v10/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`;
	
	const res = await fetch(url, {
		headers: {
			Authorization: `Bot ${process.env.DISCORD_TOKEN}`
		},
		method: 'GET'
	});
	return res;
}

async function setRole(user, role) {
	const url = `https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${user.id}/roles/${role}`;
	
	const res = await fetch(url, {
		headers: {
			Authorization: `Bot ${process.env.DISCORD_TOKEN}`
		},
		method: 'PUT'
	});
	return res;
}

async function getMemberInfo(user) {
	const url = `https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${user.id}`;

	const res = await fetch(url, {
		headers: {
			Authorization: `Bot ${process.env.DISCORD_TOKEN}`
		},
		method: 'GET'
	});
	return res;
}