import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '@/constant/colors';

// Define the props for the LineGraph component
interface LineGraphProps {
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        tension: number;
    }[];
    labels: string[]; // X-axis labels
}

const screenWidth = Dimensions.get('window').width;

const LineGraph: React.FC<LineGraphProps> = ({ datasets, labels }) => {
    // Convert datasets to react-native-chart-kit format
    // react-native-chart-kit LineChart supports multiple datasets
    const chartData = {
        labels: labels,
        datasets: datasets.map(dataset => ({
            data: dataset.data,
            color: (opacity = 1) => {
                // Extract RGB values from rgba string
                const rgbaMatch = dataset.borderColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (rgbaMatch) {
                    const [, r, g, b] = rgbaMatch;
                    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                }
                // Fallback for hex colors
                return dataset.borderColor;
            },
            strokeWidth: 2,
        })),
        legend: datasets.map(d => d.label),
    };

    const chartConfig = {
        backgroundColor: colors.white,
        backgroundGradientFrom: colors.white,
        backgroundGradientTo: colors.white,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '5',
            strokeWidth: '2',
        },
        formatYLabel: (value: string) => {
            const num = parseFloat(value);
            return num.toString();
        },
    };

    if (datasets.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <LineChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier={datasets[0]?.tension !== 0}
                style={styles.chart}
                withDots={true}
                withShadow={false}
                fromZero={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});

export default LineGraph;
