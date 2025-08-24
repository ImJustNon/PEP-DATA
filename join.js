const path = require("path");
const fs = require("fs");

(async() => {
    const files = fs.readdirSync(path.join(__dirname, "data"));
    const jsonData = [];

    files.sort((a, b) => parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]));
    
    for (const file of files) {
        if (path.extname(file) === ".json") {
            const filePath = path.join(__dirname, "data", file);
            const fileData = fs.readFileSync(filePath, "utf-8");
            jsonData.push(...JSON.parse(fileData));
        }
    }

    fs.writeFileSync(path.join(__dirname, "joined.json"), JSON.stringify(jsonData), "utf-8");
})();

