import { useContext } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { scrollChart } from "../Header/WeatherInfo";
import { TemperatureContext } from "../../../App";
import { months } from "../Header/DayInfo";
import HoursChart from "./HoursChart";
import "./DayDetails.css";

interface HoursInterface {
    sunrise: string;
    sunset: string;
}

const themes = {
    centerElement: "flex justify-center items-center",
};

export const convertDate = (dateToFormat: string) => {
    const day = parseInt(dateToFormat.split(" ")[0].split("-")[2]);
    const month = parseInt(dateToFormat.split(" ")[0].split("-")[1]);

    return {
        day: day >= 10 ? day.toString() : "0" + day,
        month: month >= 10 ? month.toString() : "0" + month,
        year: parseInt(dateToFormat.split(" ")[0].split("-")[0]),
    };
};

const DayDetails = () => {
    const { weather, active } = useContext(TemperatureContext);

    const { day, month, year } = convertDate(
        weather?.forecast.forecastday[active].date
    );

    const CurrentHour = () => {
        let hour = new Date().getHours().toString();
        let minute = new Date().getMinutes().toString();
        if (parseInt(hour) < 10) {
            hour = "0" + hour;
        }
        if (parseInt(minute) < 10) {
            minute = "0" + minute;
        }
        return <>{hour + ":" + minute}</>;
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
            year,
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours.sunrise.split(":")[0]),
            parseInt(hours.sunrise.split(":")[1])
        ).getTime();

        const sunSetHour = new Date(
            year,
            parseInt(month) - 1,
            parseInt(day),
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
            className={`top-[75%] w-[90%] rounded-[6px] bg-sky-800 shadow-[0_0_20px_-10px_rgb(255,255,255)]`}
        >
            <div
                className={`flex flex-wrap sm:flex-nowrap gap-[10px] mx-[30px] my-[15px]`}
            >
                <div
                    className={`w-[100%] sm:w-[40%] flex sm:flex-col gap-[10px]`}
                >
                    <div className={`text-[2rem] flex gap-[8px]`}>
                        <b>{day} </b>
                        <span> {months[parseInt(month) - 1]} </span>
                    </div>
                    <div className={`flex justify-start items-center`}>
                        <span>
                            <Link to={`/date/${year}-${month}-${day}`}>
                                <span className={`text-[20px]`}>Szczegóły</span>
                            </Link>
                        </span>
                    </div>
                </div>
                <div className={`w-[100%] sm:w-[60%] grid grid-rows-3`}>
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
            <div className={`flex justify-center w-[100%] relative`}>
                <button
                    className={`absolute left-0 translate-x-[-50%] top-[40%] translate-y-[-50%] z-10 bg-sky-600 rounded-full p-[3px] opacity-70`}
                    onClick={() => scrollChart("left", ".chart__field")}
                >
                    <Icon icon="bxs:left-arrow" />
                </button>
                <button
                    className={`absolute left-full translate-x-[-50%] top-[40%] translate-y-[-50%] z-10 bg-sky-600 rounded-full p-[3px] opacity-70`}
                    onClick={() => scrollChart("right", ".chart__field")}
                >
                    <Icon icon="bxs:left-arrow" rotate={2} />
                </button>
                <div
                    className={`w-[100%] chart__field overflow-x-scroll py-[20px]`}
                >
                    <HoursChart />
                </div>
            </div>
        </div>
    );
};

export default DayDetails;
