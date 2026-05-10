import * as XLSX from 'xlsx';

export const exportToExcel = <T extends object>(data: T[], fileName: string) => {
  const cleanedData = data.map((item: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, id, __v, createdAt, updatedAt, password, ...rest } = item;
    return rest;
  });
  
  const worksheet = XLSX.utils.json_to_sheet(cleanedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
