import { useContext } from "react";
import { TemperatureContext } from "../App";
import { months } from "./DayInfo";
import { daysInWeek } from "./WeatherInfo";
import { Icon } from "@iconify/react";

interface HoursInterface {
    sunrise: string;
    sunset: string;
}

const DayDetails = () => {
    const { weather, active } = useContext(TemperatureContext);
    const date = {
        day: parseInt(
            weather?.forecast.forecastday[active].date
                .split(" ")[0]
                .split("-")[2]
        ),
        month: parseInt(
            weather?.forecast.forecastday[active].date
                .split(" ")[0]
                .split("-")[1]
        ),
        year: weather?.forecast.forecastday[active].date
            .split(" ")[0]
            .split("-")[0],
    };

    const toFullHour = (hour: string) => {
        let hourObject = {
            splittedHour: hour.split(" ")[0],
            splittedHourUnit: hour.split(" ")[1],
        };

        if (hourObject.splittedHourUnit === "PM") {
            hourObject.splittedHour =
                (
                    parseInt(hourObject.splittedHour.toString().split(":")[0]) +
                    12
                ).toString() + `:${hourObject.splittedHour.split(":")[1]}`;
        }
        return hourObject.splittedHour;
    };

    const hours: HoursInterface = {
        sunrise: toFullHour(weather.forecast.forecastday[active].astro.sunrise),
        sunset: toFullHour(weather.forecast.forecastday[active].astro.sunset),
    };

    const sunRiseToSunSet = () => {
        const currentDate = new Date();
        const currentHour = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            currentDate.getHours(),
            currentDate.getMinutes()
        ).getTime();

        const sunRiseHour = new Date(
            date.year,
            date.month - 1,
            date.day,
            parseInt(hours.sunrise.split(":")[0]),
            parseInt(hours.sunrise.split(":")[1])
        ).getTime();
        const sunSetHour = new Date(
            date.year,
            date.month - 1,
            date.day,
            parseInt(hours.sunset.split(":")[0]),
            parseInt(hours.sunset.split(":")[1])
        ).getTime();
        const minutes = (sunSetHour - sunRiseHour) / 60000;

        const hoursDifference = Math.floor(minutes / 60);
        const minutesDifference = minutes % 60;

        let percentsOfDay = 0;

        if (currentHour / sunSetHour > 1) {
            percentsOfDay = 100;
        } else {
            percentsOfDay = (currentHour / sunSetHour) * 100;
        }

        return {
            difference:
                hoursDifference + " godz. " + minutesDifference + " min",
            percentsOfDay: percentsOfDay,
        };
    };

    return (
        <div
            className={`top-[75%] w-[80%] px-[30px] py-[10px] rounded-[6px] border-black boredr-[1px] bg-sky-800`}
        >
            <div className={`flex gap-[10px] items-stretch`}>
                <div
                    className={`w-[40%] h-[100%] flex flex-col justify-around`}
                >
                    <div className={`text-[2rem] font-bold`}>
                        {date.day} {months[date.month - 1]}
                    </div>
                    <div className={`text-[1.5rem]`}>
                        {
                            daysInWeek[
                                new Date(
                                    date.year,
                                    date.month - 1,
                                    date.day
                                ).getDay()
                            ].fullDayName
                        }
                    </div>
                </div>
                <div className={`w-[60%] flex`}>
                    <div
                        className={`w-[35%] h-[100%] flex justify-center items-center`}
                    >
                        <div
                            className={`flex flex-col justify-center gap-[5px] items-center w-[50%] h-[100%]`}
                        >
                            <div>
                                <Icon
                                    icon="solar:sunrise-linear"
                                    width="30"
                                    color="black"
                                />
                            </div>
                            <span>Wschód</span>
                            <b>{hours.sunrise}</b>
                        </div>
                    </div>
                    <div
                        className={`w-[30%] h-[100%] flex flex-col justify-center gap-[5px] items-center`}
                    >
                        <div
                            className={`w-[90%] h-[8px] rounded-[4px] bg-yellow-300 overflow-hidden`}
                        >
                            <div
                                style={{
                                    width: `${
                                        sunRiseToSunSet().percentsOfDay
                                    }%`,
                                }}
                                className={`h-[100%] bg-indigo-950 rounded-r-[4px]`}
                            ></div>
                        </div>
                        <div
                            className={`w-[100%] flex justify-center items-center`}
                        >
                            {sunRiseToSunSet().difference}
                        </div>
                    </div>
                    <div
                        className={`w-[35%] h-[100%] flex justify-center items-center`}
                    >
                        <div
                            className={`flex flex-col justify-center gap-[5px] items-center w-[50%] h-[100%]`}
                        >
                            <div>
                                <Icon
                                    icon="solar:sunset-linear"
                                    width="30"
                                    color="black"
                                />
                            </div>
                            <span>Wschód</span>
                            <b>{hours.sunset}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayDetails;
