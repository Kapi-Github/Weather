import { useContext } from "react";
import { TemperatureContext } from "../App";

export const daysInWeek: {
    id: number;
    shortDayName: string;
    fullDayName: string;
}[] = [
    { id: 0, shortDayName: "Niedz", fullDayName: "Niedziela" },
    { id: 1, shortDayName: "Pon", fullDayName: "Poniedziałek" },
    { id: 2, shortDayName: "Wt", fullDayName: "Wtorek" },
    { id: 3, shortDayName: "Śr", fullDayName: "Środa" },
    { id: 4, shortDayName: "Czw", fullDayName: "Czwartek" },
    { id: 5, shortDayName: "Pt", fullDayName: "Piątek" },
    { id: 6, shortDayName: "Sob", fullDayName: "Sobota" },
];

const WeatherInfo = () => {
    const { weather, temperatureUnit, setActive } =
        useContext(TemperatureContext);

    return (
        <div className={`grid grid-cols-7 gap-[10px] w-[90%]`}>
            {weather.forecast.forecastday.map(
                (dayForecast: any, index: number) => {
                    const year = dayForecast.date.split("-")[0];
                    const month = parseInt(dayForecast.date.split("-")[1]);
                    const day = parseInt(dayForecast.date.split("-")[2]);
                    const monthName =
                        daysInWeek[new Date(year, month - 1, day).getDay()];

                    return (
                        <div
                            key={index}
                            className={`bg-sky-800 flex flex-col items-center rounded-[8px] p-[5px] cursor-pointer hover:bg-[#075D8E] transition-all duration-200 ease-in-out`}
                            onClick={() => setActive(index)}
                        >
                            <div className={`text-center`}>
                                <b>
                                    {monthName.shortDayName}. {day}
                                </b>
                            </div>
                            <img
                                src={dayForecast.day.condition.icon}
                                alt="Weather icon"
                            />
                            <div>
                                <span>
                                    {temperatureUnit === "C" ? (
                                        <>
                                            {Math.round(
                                                dayForecast.day.mintemp_c
                                            )}
                                            °{" - "}
                                            {Math.round(
                                                dayForecast.day.maxtemp_c
                                            )}
                                            °
                                        </>
                                    ) : (
                                        <>
                                            {Math.round(
                                                dayForecast.day.mintemp_f
                                            )}
                                            °{" - "}
                                            {Math.round(
                                                dayForecast.day.maxtemp_f
                                            )}
                                            °
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
};

export default WeatherInfo;
