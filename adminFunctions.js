const fs = require("fs"); // The file system module
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

//! All users function
function allAdminsList(admins, bot, msg, users) {
    if (admins.includes(msg.from.username)) {
        bot.sendMessage(msg.chat.id, `Admins:\n${admins.join(",\n")}`);
    } else {
        bot.sendMessage(msg.chat.id, "You cannot access this command.");
    }
}

//! All admins function
function allUsersList(admins, bot, msg, users) {
    if (admins.includes(msg.from.username)) {
        bot.sendMessage(msg.chat.id, `Users:\n${users.join(",\n")}`);
    } else {
        bot.sendMessage(msg.chat.id, "You cannot access this command.");
    }
}

//! Add admin function
function addAdmin(admins, bot, msg, users) {
    if (admins.includes(msg.from.username)) {
        const username = msg.text.split(" ")[1];
        if (users.includes(username)) {
            admins.push(username);
            writeDataToJson("./data/admins.json", admins);
            bot.sendMessage(msg.chat.id, `User ${username} is now an admin.`);
        } else {
            bot.sendMessage(msg.chat.id, "This user is not in the users list.");
        }
    } else {
        bot.sendMessage(msg.chat.id, "You cannot access this command.");
    }
}

module.exports = {
	allAdminsList: allAdminsList,
    allUsersList: allUsersList,
    addAdmin: addAdmin,
};
