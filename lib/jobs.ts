import fs from "fs";
import path from "path";
import csv from "csv-parser";

export type Job = {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
};

export async function getJobs(): Promise<Job[]> {
  const filePath = path.join(process.cwd(), "public", "jobs.csv"); 
  const jobs: Job[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        jobs.push({
          title: row["Job Title"],
          company: row["Company Name"],
          location: row["Location"],
          description: row["Job Description"],
          requirements: row["Requirements"],
        });
      })
      .on("end", () => {
        resolve(jobs);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
