import {
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { months } from "./DayInfo";
import { useContext, useMemo, useState } from "react";
import { TemperatureContext } from "../App";

interface DaysChartInterface {
    date: string;
    temp_c: number;
    temp_f: number;
}

const DaysChart = () => {
    const { weather, temperatureUnit } = useContext(TemperatureContext);
    const [windowWidth, setWindowWidth] = useState<number>(innerWidth);

    addEventListener("resize", (event) => {
        setWindowWidth((event.currentTarget as Window).innerWidth);
    });

    const nextDays = useMemo(() => {
        let daysArray: DaysChartInterface[] = [];
        weather.forecast.forecastday.map((day: any) => {
            daysArray.push({
                date: day.date.split("-")[1] + "." + day.date.split("-")[2],
                temp_c: day.day.avgtemp_c,
                temp_f: day.day.avgtemp_f,
            });
        });
        return daysArray;
    }, [weather]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload.length) return null;
        console.log(payload[0].payload);
        return (
            <div
                className={`w-[120px] bg-gray-950 flex flex-col justify-center items-center border-[1px] border-gray-600 bg-transparent opacity-70`}
            >
                <div className={``}>
                    {label.split(".")[1]} {months[label.split(".")[0]]}
                </div>
            </div>
        );
    };

    return (
        <LineChart width={windowWidth * 0.75} height={200} data={nextDays}>
            <XAxis dataKey="date" stroke="rgb(255, 255, 255)" tickMargin={10} />
            <YAxis
                dataKey={`${temperatureUnit === "C" ? "temp_c" : "temp_f"}`}
                stroke="rgb(255, 255, 255)"
                tickMargin={10}
            />
            <CartesianGrid strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} />
            <Line
                type="monotone"
                dataKey={`${temperatureUnit === "C" ? "temp_c" : "temp_f"}`}
                stroke="rgb(1, 10, 100)"
            />
        </LineChart>
    );
};

export default DaysChart;
