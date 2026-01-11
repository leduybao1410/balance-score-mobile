export const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8']; // X-axis labels
export const datasets: any = [
    {
        label: 'Dataset 1',
        data: [10, 20, -5, 15, -10, 25, 5, -55], // Y-axis data points
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill under line
    },
    {
        label: 'Dataset 2',
        data: [-5, 10, 15, -10, 230, -15, 10, 5], // Y-axis data points
        borderColor: 'rgba(255, 99, 132, 1)', // Line color
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Fill under line
    },
    {
        label: 'Dataset 3',
        data: [5, -15, 10, 20, -5, 15, -10, 25], // Y-axis data points
        borderColor: 'rgba(54, 162, 235, 1)', // Line color
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Fill under line
    },
];


export type lineDataType = {
    label: string,
    data: number[],
    borderColor: string,
    backgroundColor: string,
    tension: number,
}