const fs = require("fs"); // The file system module
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");

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

const users = readDataFromJson("./data/users.json");

// Create a bot instance
const bot = new TelegramBot(config.botToken, { polling: true });

//! Handle the /start command and add the user to the Users array
bot.on("message", (msg) => {
    if (msg.text === "/start") {
        bot.sendMessage(msg.chat.id, "Hello! I'm your Telegram bot.");

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

    //! Users command
    if (msg.text === "/users") {
        const usersList = users.join(", ");
        bot.sendMessage(msg.chat.id, `Users: ${usersList}`);
    }
});

console.log("Bot is running...");
