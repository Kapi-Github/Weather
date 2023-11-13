import { useContext } from "react";
import { TemperatureContext } from "../../App";
import { months } from "../DayInfo";
import { daysInWeek } from "../WeatherInfo";
import { Icon } from "@iconify/react";
import HoursChart from "../HoursChart";
import "./DayDetails.css";

interface HoursInterface {
    sunrise: string;
    sunset: string;
}

const themes = {
    centerElement: "flex justify-center items-center",
};

const DayDetails = () => {
    const { weather, active } = useContext(TemperatureContext);

    const CurrentHour = () => {
        let hour = new Date().getHours().toString();
        let minute = new Date().getMinutes().toString();
        if (parseInt(hour) < 10) {
            hour = "0" + hour;
        }
        if (parseInt(minute) < 10) {
            hour = "0" + hour;
        }
        return <>{hour + ":" + minute}</>;
    };

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

        const todayMinutes = (sunSetHour - currentHour) / 60000;

        if (active === 0) {
            if (currentHour / sunSetHour > 1) {
                percentsOfDay = 100;
            } else {
                percentsOfDay = 100 - (todayMinutes / minutes) * 100;
            }
        } else {
            percentsOfDay = 0;
        }

        return {
            difference:
                hoursDifference + " godz. " + minutesDifference + " min",
            percentsOfDay: percentsOfDay,
        };
    };

    return (
        <div
            className={`top-[75%] w-[80%] rounded-[6px] border-black boredr-[1px] bg-sky-800`}
        >
            <div className={`flex gap-[10px] mx-[30px] my-[15px]`}>
                <div
                    className={`w-[40%] h-[100%] flex flex-col justify-around`}
                >
                    <div className={`text-[2rem]`}>
                        <b>{date.day} </b> <span>{months[date.month - 1]}</span>
                    </div>
                    <div className={`text-[1.3rem]`}>
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
                <div
                    className={`w-[60%] max-w-[400px] min-w-[270px] grid grid-rows-3`}
                >
                    <div
                        style={{
                            gridTemplateColumns: "30% 40% 30%",
                            display: "grid",
                            gap: "10px",
                        }}
                    >
                        <div className={`${themes.centerElement}`}>
                            <Icon
                                icon="solar:sunrise-linear"
                                width="30"
                                height="30"
                                color="black"
                            />
                        </div>
                        <div className={`${themes.centerElement}`}>
                            <CurrentHour />
                        </div>
                        <div className={`${themes.centerElement}`}>
                            <Icon
                                icon="solar:sunset-linear"
                                width="30"
                                height="30"
                                color="black"
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            gridTemplateColumns: "30% 40% 30%",
                            display: "grid",
                            gap: "10px",
                        }}
                    >
                        <div className={`${themes.centerElement} flex-col`}>
                            <span>Wschód</span>
                        </div>
                        <div className={`${themes.centerElement}`}>
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
                        </div>
                        <div className={`${themes.centerElement} flex-col`}>
                            <span>Zachód</span>
                        </div>
                    </div>
                    <div
                        style={{
                            gridTemplateColumns: "30% 40% 30%",
                            display: "grid",
                            gap: "10px",
                        }}
                    >
                        <div className={`${themes.centerElement}`}>
                            <b>{hours.sunrise}</b>
                        </div>
                        <div className={`${themes.centerElement}`}>
                            {sunRiseToSunSet().difference}
                        </div>
                        <div className={`${themes.centerElement}`}>
                            <b>{hours.sunset}</b>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`w-[100%] overflow-x-scroll`}>
                <HoursChart />
            </div>
        </div>
    );
};

export default DayDetails;
