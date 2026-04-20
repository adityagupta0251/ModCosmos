// Require the necessary discord.js classes
import dotend from "dotenv";
dotend.config();
import { client , TOKEN , handleTodoCommands} from "./command/to_do";

client.once("ready", () => {
  console.log(`Bot is online as ${client.user?.tag}`);

});

  client.on("interactionCreate", async (interaction) => {
    await handleTodoCommands(interaction);
});

client.login(TOKEN);
