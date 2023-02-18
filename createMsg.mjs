import fetch from "node-fetch";

export async function createMsg() {
    const method = 'POST';
    const Authorization = `Bot ${process.env.DISCORD_TOKEN}`;
    const headers = { Authorization, "Content-Type": "application/json" };

    const urlDm = `https://discord.com/api/v10/users/@me/channels`;
    const DmBody = JSON.stringify({ "recipient_id": "257591787646877696" });
    const DmOptions = { method, headers, body: DmBody };

    const dmFetch = await fetch(urlDm, DmOptions);
    const dmJson = await dmFetch.json();
    
	const urlMsg = `https://discord.com/api/v10/channels/${dmJson.id}/messages`;
    const MsgBody = JSON.stringify({ "content": "hola mundo!" });
    const MsgOptions = { method, headers, body: MsgBody }
	
	await fetch(urlMsg, MsgOptions);
}