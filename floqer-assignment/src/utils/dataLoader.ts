import Papa from 'papaparse';

export interface SalaryData {
  year: number;
  totalJobs: number;
  averageSalary: number;
  jobTitles: Record<string, number>;
}

export const loadSalaryData = async (): Promise<SalaryData[]> => {
  const response = await fetch('/salaries.csv');
  const csvText = await response.text();

  const parsedData = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  const data = parsedData.data;

  const yearMap: Record<number, SalaryData> = {};

  data.forEach((row: any) => {
    console.log(row);
    const year = row.work_year;
    const salary = row.salary_in_usd;
    const jobTitle = row.job_title;

    if (!yearMap[year]) {
      yearMap[year] = {
        year,
        totalJobs: 0,
        averageSalary: 0,
        jobTitles: {},
      };
    }

    yearMap[year].totalJobs += 1;
    yearMap[year].averageSalary += salary;
    if (!yearMap[year].jobTitles[jobTitle]) {
      yearMap[year].jobTitles[jobTitle] = 0;
    }
    yearMap[year].jobTitles[jobTitle] += 1;
  });

  return Object.values(yearMap).map((yearData) => ({
    ...yearData,
    averageSalary: yearData.averageSalary / yearData.totalJobs,
  }));
};
