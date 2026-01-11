import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import MySwitchButton from '../switch/switch_button';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';

// Define the props for the LineGraph component
interface LineGraphProps {
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
    }[];
    labels: string[]; // X-axis labels
    style?: string;
}

const screenWidth = Dimensions.get('window').width;

const LineGraph: React.FC<LineGraphProps> = ({ datasets, labels, style }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [isZoomed, setIsZoomed] = useState<boolean>(false);

    // Convert datasets to react-native-chart-kit format
    // react-native-chart-kit LineChart only supports one dataset at a time
    // We'll use the first dataset, or combine them if needed
    const chartData = {
        labels: labels,
        datasets: datasets.map(dataset => ({
            data: dataset.data,
            color: (opacity = 1) => dataset.borderColor.replace('1)', `${opacity})`).replace('rgba(', '').replace(')', ''),
            strokeWidth: 2,
        })),
        legend: datasets.map(d => d.label),
    };

    const chartConfig = {
        backgroundColor: isDarkMode ? colors.black : colors.white,
        backgroundGradientFrom: isDarkMode ? colors.black : colors.white,
        backgroundGradientTo: isDarkMode ? colors.black : colors.white,
        decimalPlaces: 0,
        color: (opacity = 1) => isDarkMode
            ? `rgba(255, 255, 255, ${opacity})`
            : `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => isDarkMode
            ? `rgba(255, 255, 255, ${opacity})`
            : `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '3',
            strokeWidth: '2',
        },
        formatYLabel: (value: string) => {
            const num = parseFloat(value);
            return num.toString();
        },
    };

    const chartContent = (
        <View style={[styles.chartContainer, isDarkMode && styles.darkMode]}>
            {datasets.length > 0 && (
                <LineChart
                    data={chartData}
                    width={isZoomed ? screenWidth - 32 : screenWidth - 100}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withDots={true}
                    withShadow={false}
                    fromZero={false}
                />
            )}
        </View>
    );

    if (isZoomed) {
        return (
            <Modal
                visible={isZoomed}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsZoomed(false)}
            >
                <View style={styles.zoomContainer}>
                    <View style={styles.zoomContent}>
                        {chartContent}
                        <View style={styles.controls}>
                            <MySwitchButton
                                firstLable=""
                                fisrtLabelIcon={<Ionicons name="moon" size={ResponsiveFontSize(20)} color={colors.white} />}
                                secondLabelIcon={<Ionicons name="sunny" size={ResponsiveFontSize(20)} color={colors.white} />}
                                swPaddingHorizontal={2}
                                swPaddingVertical={2}
                                backgroundColor={isDarkMode ? colors.primary[950] : colors['dark-grey'][500]}
                                activeTextColor={colors.white}
                                activeBackgroundColor={isDarkMode ? colors.primary[950] : colors.yellow[500]}
                                secondLabel=""
                                isOn={isDarkMode}
                                setIsOn={setIsDarkMode}
                            />
                            <TouchableOpacity
                                onPress={() => setIsZoomed(false)}
                                style={styles.zoomButton}
                            >
                                <MaterialIcons name="zoom-out-map" size={ResponsiveFontSize(16)} color={colors.black} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <View style={[styles.container, isDarkMode && styles.darkMode, style && { borderRadius: 8 }]}>
            {chartContent}
            <View style={styles.controls}>
                <MySwitchButton
                    firstLable=""
                    fisrtLabelIcon={<Ionicons name="moon" size={ResponsiveFontSize(20)} color={colors.white} />}
                    secondLabelIcon={<Ionicons name="sunny" size={ResponsiveFontSize(20)} color={colors.white} />}
                    swPaddingHorizontal={2}
                    swPaddingVertical={2}
                    backgroundColor={isDarkMode ? colors.primary[950] : colors['dark-grey'][500]}
                    activeTextColor={colors.white}
                    activeBackgroundColor={isDarkMode ? colors.primary[950] : colors.yellow[500]}
                    secondLabel=""
                    isOn={isDarkMode}
                    setIsOn={setIsDarkMode}
                />
                <TouchableOpacity
                    onPress={() => setIsZoomed(true)}
                    style={styles.zoomButton}
                >
                    <MaterialIcons name="zoom-in-map" size={ResponsiveFontSize(16)} color={colors.black} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        padding: 8,
        backgroundColor: colors.white,
        borderRadius: 8,
    },
    darkMode: {
        backgroundColor: colors.black,
    },
    chartContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    controls: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 16,
        padding: 8,
    },
    zoomContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomContent: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        width: screenWidth - 32,
    },
    zoomButton: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 8,
    },
});

export default LineGraph;
