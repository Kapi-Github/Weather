import { useContext, useMemo } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  LabelList,
  Dot,
} from "recharts";
import { TemperatureContext } from "../App";

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
    weather.forecast.forecastday[active].hour.map((hour: any) => {
      hoursArray.push({
        hour: hour.time.split(" ")[1],
        temp_c: hour.temp_c,
        temp_f: hour.temp_f,
        description: hour.condition.text,
        wind: hour.wind_kph,
      });
    });
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
          <div className={`w-[50%]`}>{payload[0].payload.temp_c}°C</div>
        </div>
        <hr className={`border-gray-300`} />
        <div>{payload[0].payload.description}</div>
        <div>Wiatr: {payload[0].payload.wind}km/h</div>
      </div>
    );
  };

  const DayTemperature = ({ x, y, value }: any) => {
    return (
      <g>
        <Dot cx={x} cy={y} r={2} fill="black" />
        <text
          x={x}
          y={y + 15}
          fill="#FFF"
          textAnchor="middle"
          dominantBaseline="middle"
          opacity={0.7}
          className={`font-bold text-[1.2rem]`}
        >
          {value}
          {"°"}
        </text>
      </g>
    );
  };

  return (
    <AreaChart
      width={2000}
      height={200}
      data={nextHours}
      margin={{ left: 20, right: 20 }}
    >
      <defs>
        <linearGradient id="temperature" x1="0" y1="0" x2="0" y2="1">
          <stop offset="10%" stopColor="#ffff0e" stopOpacity={1} />
          <stop offset="90%" stopColor="#fcfc18" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <XAxis
        dataKey="hour"
        stroke="rgb(255, 255, 255)"
        className={`text-[0.9rem]`}
      />
      <CartesianGrid strokeDasharray="4 4" />
      <Tooltip content={<CustomTooltip />} />
      <Area
        type="monotone"
        dataKey={`${temperatureUnit === "C" ? "temp_c" : "temp_f"}`}
        stroke="rgb(1, 10, 100)"
        fill="url(#temperature)"
      >
        <LabelList
          dataKey={`${temperatureUnit === "C" ? "temp_c" : "temp_f"}`}
          content={DayTemperature}
        />
      </Area>
    </AreaChart>
  );
};

export default HoursChart;
