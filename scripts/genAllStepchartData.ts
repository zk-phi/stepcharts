import * as fs from "fs";
import { getAllStepchartData } from "../lib/getAllStepchartData";

fs.writeFileSync(
  `${__dirname}/../resources/stepchartData.json`,
  JSON.stringify(getAllStepchartData()),
);
