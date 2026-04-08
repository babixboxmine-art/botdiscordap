export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot conectado como: ${client.user.tag}`);
    console.log(`🎮 DEV_MODE: SIM (Sem banco de dados)`);
    client.user.setActivity('apostas em andamento', { type: 'WATCHING' });
  },
};