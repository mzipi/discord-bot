import 'dotenv/config';
import fetch from 'node-fetch';
import express from 'express';
import {
	verifyKeyMiddleware,
	InteractionResponseType,
	InteractionType
} from 'discord-interactions';

const app = express();
const PORT = process.env.PORT || 3000;

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {

	const { type, id, data } = req.body;

	if (type === InteractionType.APPLICATION_COMMAND) {

		const { name } = data;

		if (name === 'help') {
			const data = await getCommands();
			const commands = await data.json();
			const commandsArray = commands.map((c) => c['name']);
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
							type: 1,
							components: [
								{
									type: 4,
									custom_id: 3324235,
									label: "Name",
									style: 1
								}
							]
						}
					]
				}
			});
		}
	
		if (name === 'button') {
			return res.send({
				type: 4,
				data: {
					components: [
						{
							type: 1,
							components: [
								{
									type: 2,
									style: 3,
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
				type: 4,
				data: {
					content: 'Selecciona un rol',
					components: [
						{
							type: 1,
							components: [
								{
									type: 6,
									custom_id: 23254626,
								}
							]
						}
					]
				}
			})
		}

		if (name === 'menu') {
			return res.send({
				type: 4,
				data: {
					content: "Elije una opción",
					components: [
						{
							type: 1,
							components: [
								{
									type: 3,
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
				type: 4,
				data: { content: `Comando: ${name}` }
			});
		}

		if (name === 'opciones') {
			return res.send({
				type: 4,
				data: { content: `Comando: ${name}` }
			});
		}
	
		if (!req.body.data.name) {
			return res.send({
				type: 4,
				data: { content: 'No existe ese comando' }
			});
		}
	}

	if (type === 3) {
		const role = await req.body.data.values;
		const user = req.body.member.user;
		const rolResponse = await setRole(user, role);
		res.send({
			type: 4,
			data: {
				content: 'Recibido'
			}
		})
	}
});

app.listen(PORT, () => console.log('Running...'));

async function getCommands() {
	const url = `https://discord.com/api/v10/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`;
	
	const res = await fetch(url, {
		headers: {
		Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
			'Content-Type': 'application/json; charset=UTF-8',
			'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
		},
		method: 'GET'
	});
	return res;
}

async function setRole(user, role) {
	const url = `https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${user.id}/roles/${role}`;
	
	const res = await fetch(url, {
		headers: {
		Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
			'Content-Type': 'application/json; charset=UTF-8',
			'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
		},
		method: 'PUT'
	});
	return res;
}