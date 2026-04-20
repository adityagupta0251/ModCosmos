import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  type Interaction,
} from "discord.js";

export const TOKEN = process.env.BOT_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const todoStore = new Map();


const commands = [
  new SlashCommandBuilder()
    .setName("todo")
    .setDescription("Create and manage your task to-dos")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a new task")
        .addStringOption((option) =>
          option
            .setName("task")
            .setDescription("What do you need to do?")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("View your current to-do list")
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a task by its number")
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription("The number of the task to remove (see /todo list)")
            .setRequired(true)
        )
    ),
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN as string);

(async () => {
  try{
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(CLIENT_ID as string), { body: commands });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error registering commands",error);
  }
})();

export async function handleTodoCommands(interaction: Interaction){
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "todo") {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    if(!todoStore.has(userId)) {
      todoStore.set(userId, []);
    }

    const userTodos = todoStore.get(userId) as string[];
    
    if (subcommand === "add") {
      const task = interaction.options.getString("task");
      userTodos.push(task as string);

      const embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("✅Task Added")
      .setDescription(`Added: **${task}**\n\nYou now have ${userTodos.length} task(s).`);

      await interaction.reply({ embeds: [embed] });
    }

    else if (subcommand === "list") {
      if (userTodos.length === 0) {
        await interaction.reply("Your to-do list is empty! Use `/todo add` to add tasks.");
        return;
      }

      const listString = userTodos
      .map((task, index) => `${index + 1}. ${task}`)
      .join("\n");

      const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("📋 Your To-Do List")
      .setDescription(listString);

      await interaction.reply({embeds: [embed]});

    }
  } 
};



