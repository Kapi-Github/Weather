import { useContext, useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    LabelList,
    Dot,
} from "recharts";
import { TemperatureContext } from "../../../App";

interface HoursChartInterface {
    hour: string;
    temp_c: number;
    temp_f: number;
    description: string;
    wind: number;
}

const HoursChart = () => {
    const { weather, active, temperatureUnit } = useContext(TemperatureContext);

    const nextHours = useMemo(() => {
        const hoursArray: HoursChartInterface[] = [];
        weather.forecast.forecastday[active].hour.map(
            (hour: any, index: number) => {
                if (index % 3 === 0) {
                    hoursArray.push({
                        hour: hour.time.split(" ")[1],
                        temp_c: hour.temp_c,
                        temp_f: hour.temp_f,
                        description: hour.condition.text,
                        wind: hour.gust_kph,
                    });
                }
            }
        );
        return hoursArray;
    }, [active, weather]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload.length) return null;

        return (
            <div
                className={`bg-blue-950 py-[3px] px-[5px] rounded-[4px] opacity-80 flex flex-col gap-[5px] max-w-[150px]`}
            >
                <div className={`flex gap-[15px]`}>
                    <div className={`w-[50%]`}>{label}</div>
                    <hr className={`border-gray-300 rotate-90`} />
                    <div className={`w-[50%]`}>
                        {payload[0].payload.temp_c}°C
                    </div>
                </div>
                <hr className={`border-gray-300`} />
                <div>{payload[0].payload.description}</div>
                <div>Wiatr: {payload[0].payload.wind} km/h</div>
            </div>
        );
    };

    const DayTemperature = ({ x, y, value }: any) => {
        return (
            <g>
                <Dot cx={x} cy={y} r={4} fill="black" />
                <text
                    x={x}
                    y={y - 15}
                    fill="#000"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    opacity={0.7}
                    className={`font-bold text-[1.4rem]`}
                >
                    {value}
                    {"°"}
                </text>
            </g>
        );
    };

    return (
        <ResponsiveContainer minWidth={`600px`} width={`100%`} height={250}>
            <AreaChart
                data={nextHours}
                margin={{ left: 40, right: 40, top: 40 }}
            >
                <defs>
                    <linearGradient
                        id="temperature"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="#FFF000"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="#00FF00"
                            stopOpacity={0.3}
                        />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="hour"
                    stroke="rgb(255, 255, 255)"
                    className={`text-[0.9rem]`}
                    tickMargin={10}
                />
                <CartesianGrid strokeDasharray="4 4" opacity={0.7} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey={`${temperatureUnit === "C" ? "temp_c" : "temp_f"}`}
                    stroke="rgb(0, 0, 0)"
                    fill="url(#temperature)"
                >
                    <LabelList
                        dataKey={`${
                            temperatureUnit === "C" ? "temp_c" : "temp_f"
                        }`}
                        content={DayTemperature}
                    />
                </Area>
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default HoursChart;
