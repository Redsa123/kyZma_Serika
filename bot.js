const fs = require("fs"); // The file system module
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");
const adminFunctions = require("./adminFunctions");

//? Read data from a JSON file
function readDataFromJson(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8"); // Read the file synchronously
        return JSON.parse(data); // Parse the JSON string into a JavaScript object
    } catch (error) {
        console.error(`Error reading JSON file: ${error}`);
        return null; // Or handle the error as needed (e.g., create an empty object)
    }
}

//? Write data to a JSON file
function writeDataToJson(filePath, data) {
    try {
        const jsonData = JSON.stringify(data, null, 4); // Convert the object to a JSON string (pretty-printed)
        fs.writeFileSync(filePath, jsonData, "utf8"); // Write the JSON string to the file
        console.log(`Data written to ${filePath}`);
    } catch (error) {
        console.error(`Error writing JSON file: ${error}`);
    }
}

// Read essential data from JSON files
const users = readDataFromJson("./data/users.json");
const admins = readDataFromJson("./data/admins.json");

// Create a bot instance
const bot = new TelegramBot(config.botToken, { polling: true });

//! Handle the /start command and add the user to the Users array
bot.on("message", (msg) => {
    if (msg.text === "/start") {
        bot.sendMessage(msg.chat.id, "Hello! I'm kyZma.");

        // Add the user to the usres.json file
        if (
            !users.includes(msg.from.username) &&
            !users.includes(msg.from.first_name)
        ) {
            if (msg.from.username) {
                users.push(msg.from.username);
            } else {
                users.push(msg.from.first_name);
            }
            writeDataToJson("./data/users.json", users);
        } else {
            bot.sendMessage(
                msg.chat.id,
                "You are already in the list of users."
            );
        }
    }
});

//! Handle any text message
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    //? Echo command
    if (messageText && messageText.substring(0, 1) !== "/") {
        bot.sendMessage(chatId, `You said: ${messageText}`);
    }

    //? Time command
    if (msg.text === "/time") {
        const currentTime = new Date().toLocaleTimeString();
        bot.sendMessage(msg.chat.id, `The current time is: ${currentTime}`);
    }

    //? Sender username command
    if (msg.text === "/myUsername") {
        const senderUserName = msg.from.username;
        bot.sendMessage(msg.chat.id, `Your name is: ${senderUserName}`);
    }

    //!Admin commands

    if (msg.text === "/users") {
        adminFunctions.allUsersList(admins, bot, msg, users);
    }

    if (msg.text === "/admins") {
        adminFunctions.allAdminsList(admins, bot, msg, users);
    }

    if (msg.text.split(" ")[0] == "/addAdmin") {
        adminFunctions.addAdmin(admins, bot, msg, users);
    }

    //! Onopiienko_style commands
    if (msg.text.split(" ")[0] === "/removeAdmin") {
        if (msg.from.username === "onopriienko_style") {
            const username = msg.text.split(" ")[1];
            if (admins.includes(username)) {
                admins.splice(admins.indexOf(username), 1);
                writeDataToJson("./data/admins.json", admins);
                bot.sendMessage(
                    msg.chat.id,
                    `User ${username} is no longer an admin.`
                );
            } else {
                bot.sendMessage(msg.chat.id, "This user is not an admin.");
            }
        } else {
            bot.sendMessage(msg.chat.id, "You cannot access this command.");
        }
    }
});

console.log("Bot is running...");
