// Require the necessary discord.js classes
import dotend from "dotenv";
dotend.config();
import { client , TOKEN , handleTodoCommands} from "./command/to_do";
import { Events } from "discord.js";

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Bot is online as ${client.user?.tag}`);

});

  client.on(Events.InteractionCreate, async (interaction) => {
    await handleTodoCommands(interaction);
});

client.login(TOKEN);
