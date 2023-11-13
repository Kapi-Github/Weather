import { useContext, useMemo } from "react";
import {
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { TemperatureContext } from "../App";

interface HoursChartInterface {
    hour: string;
    temp_c: number;
    temp_f: number;
}

const HoursChart = () => {
    const { weather, active, temperatureUnit } = useContext(TemperatureContext);

    const nextHours = useMemo(() => {
        const hoursArray: HoursChartInterface[] = [];
        weather.forecast.forecastday[active].hour.map((hour: any) => {
            hoursArray.push({
                hour: hour.time.split(" ")[1],
                temp_c: hour.temp_c,
                temp_f: hour.temp_f,
            });
        });
        return hoursArray;
    }, [weather]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload.length) return null;

        return <div>{payload[0].payload.temp_c}</div>;
    };

    return (
        <AreaChart width={2000} height={200} data={nextHours}>
            <defs>
                <linearGradient id="temperature" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#ffff0e" stopOpacity={1} />
                    <stop offset="90%" stopColor="#fcfc18" stopOpacity={0.2} />
                </linearGradient>
            </defs>
            <XAxis
                dataKey="hour"
                stroke="rgb(255, 255, 255)"
                tickMargin={10}
                className={`text-[0.6rem]`}
                minTickGap={0}
            />
            <YAxis
                dataKey={`${temperatureUnit === "C" ? "temp_c" : "temp_f"}`}
                stroke="rgb(255, 255, 255)"
                tickMargin={10}
            />
            <CartesianGrid strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} />
            <Area
                type="monotone"
                dataKey={`${temperatureUnit === "C" ? "temp_c" : "temp_f"}`}
                stroke="rgb(1, 10, 100)"
                fill="url(#temperature)"
            />
        </AreaChart>
    );
};

export default HoursChart;
