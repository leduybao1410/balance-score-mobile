import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

export async function exportExcel(rows: any[]) {
    try {
        // Example data
        const data = rows;

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create workbook
        const fileName = `balance_score_${(new Date()).valueOf()}`;
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `history`);

        // Convert to binary
        const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

        // Path to save
        const path = `${RNFS.DocumentDirectoryPath}/${fileName}.xlsx`;

        // Write file
        await RNFS.writeFile(path, wbout, 'base64');

        // Share / open
        await Share.open({
            url: `file://${path}`,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    } catch (error) {
        console.log('Export error:', error);
    }
}
