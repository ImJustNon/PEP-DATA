const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

(async () => {

    let isDataAvailable = true;
    let i = 0;
    while (isDataAvailable){
        const url = `https://dl.lib.kmutt.ac.th/repository/pep.php?offset=${i}`;
        const { data: html } = await axios.get(url);

        const $ = cheerio.load(html);

        const results = [];
        const rows = $('table[border="1"] tr');

        for (let i = 0; i < rows.length; i += 2) {
            let row1 = rows[i];
            let row2 = rows[i + 1];
            if (!row2) continue;

            let cols1 = $(row1).find("td");
            let cols2 = $(row2).find("td");

            results.push({
                index: $(cols1[0]).text().trim(),
                subjectCode: $(cols1[2]).text().trim(),
                subjectName: $(cols1[4]).text().trim(),
                link: $(cols1[4]).find("a").attr("href") || null,
                callNumber: $(cols2[1]).text().trim(),
                year: $(cols2[3]).text().trim(),
                semester: $(cols2[5]).text().trim(),
                examType: $(cols2[7]).text().trim(),
            });
        }

        if (results.length === 0) {
            isDataAvailable = false;
            console.log(`[Status] : no data found, offset: ${i}`);
            break;
        }
        
        console.log(`[Status] : success : ${results.length} items found, offset: ${i}, index: ${results.map(item => item.index).join(", ")}`);

        try {
            fs.writeFileSync(path.join(__dirname, "data", `pep-${i}-${results.map(item => item.index).sort((a, b) => a - b)[0]}-${results.map(item => item.index).sort((a, b) => a - b)[results.length - 1]}.json`), JSON.stringify(results), "utf-8");
            console.log(`[Status] : file written successfully`);
            i++;
        } catch (error) {
            console.error(`[Status] : error writing file`, error);
        }
    }
})();
