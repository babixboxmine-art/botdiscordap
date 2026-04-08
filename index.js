import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔥 TOKEN (usa ENV se tiver, senão usa fallback)
const TOKEN = process.env.DISCORD_TOKEN || 'SEU_TOKEN_AQUI';

// 🔥 MODO DEV
export const DEV_MODE = true;

// 🔥 BANCO MOCK (SEM MONGODB)
export const mockDatabase = {
  users: new Map(),
  filas: new Map(),
  apostas: new Map(),
  mediadores: new Map(),
  configs: {
    canais: {},
    pixs: [],
    mediadorCargo: null,
    blacklist: new Set(),
    donos: [], // 🔥 NOVO
    lucroTotal: 0, // 🔥 NOVO
  },
};

// 🔥 CLIENTE
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 🔥 COLEÇÕES
client.commands = new Collection();
client.handlers = new Collection(); // 🔥 preparado pra botões/modais

// ===================== COMMANDS =====================
async function loadCommands() {
  const commandsPath = join(__dirname, 'src', 'commands');

  if (!fs.existsSync(commandsPath)) {
    fs.mkdirSync(commandsPath, { recursive: true });
  }

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    try {
      console.log(`🔍 Carregando comando: ${file}`);

      const filePath = join(commandsPath, file);
      const command = await import(`file://${filePath}`);

      if (!command.default?.data || !command.default?.execute) {
        console.log(`⚠️ Comando inválido: ${file}`);
        continue;
      }

      client.commands.set(command.default.data.name, command.default);

      console.log(`✅ Comando carregado: ${command.default.data.name}`);
    } catch (error) {
      console.error(`❌ Erro ao carregar comando ${file}:`, error);
    }
  }
}

// ===================== EVENTS =====================
async function loadEvents() {
  const eventsPath = join(__dirname, 'src', 'events');

  if (!fs.existsSync(eventsPath)) {
    fs.mkdirSync(eventsPath, { recursive: true });
  }

  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    try {
      console.log(`🔍 Carregando evento: ${file}`);

      const filePath = join(eventsPath, file);
      const event = await import(`file://${filePath}`);

      if (!event.default?.name || !event.default?.execute) {
        console.log(`⚠️ Evento inválido: ${file}`);
        continue;
      }

      if (event.default.once) {
        client.once(event.default.name, (...args) =>
          event.default.execute(...args, client)
        );
      } else {
        client.on(event.default.name, (...args) =>
          event.default.execute(...args, client)
        );
      }

      console.log(`✅ Evento carregado: ${event.default.name}`);
    } catch (error) {
      console.error(`❌ Erro ao carregar evento ${file}:`, error);
    }
  }
}

// ===================== START =====================
async function main() {
  try {
    console.log('📂 Carregando comandos...');
    await loadCommands();

    console.log('📂 Carregando eventos...');
    await loadEvents();

    console.log('🤖 Bot iniciando...');
    await client.login(TOKEN);

  } catch (error) {
    console.error('❌ Erro ao iniciar bot:', error);
    process.exit(1);
  }
}

main();

export default client;