import * as fs from "fs";

type MixData = Mix & { simfiles: Simfile[] };

const data = fs.readFileSync("resources/stepchartData.json", "utf-8");
const parsed = JSON.parse(data) as MixData[];

export default parsed;
