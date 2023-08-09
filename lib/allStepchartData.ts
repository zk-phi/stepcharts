import * as fs from "fs";

const data = fs.readFileSync("resources/stepchartData.json");

export default JSON.parse(data);
