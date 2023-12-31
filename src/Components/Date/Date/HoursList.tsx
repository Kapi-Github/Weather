import { Link, useLocation } from "react-router-dom";
import "./description.css";
import { Icon } from "@iconify/react";

interface Props {
    dayWeather: any;
}

const HoursList = ({ dayWeather }: Props) => {
    const forecasts = [
        {
            source: "gust_kph",
            unit: "km/h",
            image: "vscode-icons:file-type-windi",
        },
        {
            source: "chance_of_rain",
            unit: "%",
            image: "twemoji:cloud-with-rain",
        },
        { source: "humidity", unit: "%", image: "lets-icons:humidity-light" },
        { source: "cloud", unit: "%", image: "bi:clouds-fill" },
    ];

    return (
        <div className={`flex flex-col items-center w-[100%]`}>
            {dayWeather.hour.map((hour: any, index: number) => (
                <div
                    key={index}
                    className={`w-[100%] max-w-[600px] cursor-pointer overflow-hidden hover:bg-sky-800 hover:shadow-[0_0_20px_-12px_rgb(255,255,255)] transition-all duration-150 ease-in-out ${
                        index != 0
                            ? "border-t-[2px] border-t-white"
                            : "border-none"
                    }`}
                >
                    <Link
                        to={`${useLocation().pathname}/hour/${
                            hour.time.split(" ")[1].split(":")[0]
                        }`}
                    >
                        <div className={`py-[10px] px-[2px] flex gap-[10px]`}>
                            <div
                                className={`text-[40px] flex justify-center items-center`}
                            >
                                {hour.time.split(" ")[1]}
                            </div>
                            <div className={`flex items-stretch flex-1`}>
                                <div
                                    className={`flex-1 flex flex-col gap-[10px]`}
                                >
                                    <div
                                        className={`flex-1 flex items-center min-w-[110px] px-[5px]`}
                                    >
                                        <p
                                            className={`current-weather text-ellipsis overflow-hidden`}
                                        >
                                            {hour.condition.text}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex-1 flex flex-wrap gap-[10px]`}
                                    >
                                        {forecasts.map((forecast, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center gap-[5px] text-[16px] px-[5px]`}
                                            >
                                                <Icon
                                                    height={`24`}
                                                    width={`24`}
                                                    icon={forecast.image}
                                                />
                                                <p>
                                                    {hour[forecast.source]}{" "}
                                                    {forecast.unit}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`flex flex-col items-center`}>
                                    <div
                                        className={`flex justify-center items-center`}
                                    >
                                        <p className={`font-bold text-[24px]`}>
                                            {hour.temp_c}°
                                        </p>
                                    </div>
                                    <img
                                        className={`aspect-square`}
                                        src={hour.condition.icon}
                                        alt={`Weather at ${index}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default HoursList;
