import { useContext } from "react";
import { TemperatureContext } from "../App";
import { Icon } from "@iconify/react";

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

export const scrollChart = (direction: string, element: string) => {
    const elementContainer = document.querySelector(element);
    if (elementContainer) {
        elementContainer.scrollTo({
            left:
                direction === "right"
                    ? elementContainer.scrollLeft + 450
                    : elementContainer.scrollLeft - 450,
            behavior: "smooth",
        });
    }
};

const WeatherInfo = () => {
    const { weather, temperatureUnit, setActive, active } =
        useContext(TemperatureContext);

    return (
        <div className={`w-[90%] relative`}>
            <button
                className={`absolute left-0 translate-x-[-50%] top-[50%] translate-y-[-50%] z-10 bg-sky-600 rounded-full p-[3px] opacity-70`}
                onClick={() => scrollChart("left", ".days__container")}
            >
                <Icon icon="bxs:left-arrow" />
            </button>
            <button
                className={`absolute left-full translate-x-[-50%] top-[50%] translate-y-[-50%] z-10 bg-sky-600 rounded-full p-[3px] opacity-70`}
                onClick={() => scrollChart("right", ".days__container")}
            >
                <Icon icon="bxs:left-arrow" rotate={2} />
            </button>
            <div className={`w-[100%] overflow-x-scroll days__container`}>
                <div className={`flex gap-[10px] w-[100%] py-[10px]`}>
                    {weather.forecast.forecastday.map(
                        (dayForecast: any, index: number) => {
                            const year = dayForecast.date.split("-")[0];
                            const month = parseInt(
                                dayForecast.date.split("-")[1]
                            );
                            const day = parseInt(
                                dayForecast.date.split("-")[2]
                            );
                            const monthName =
                                daysInWeek[
                                    new Date(year, month - 1, day).getDay()
                                ];

                            return (
                                <div
                                    key={index}
                                    className={`bg-sky-800 flex flex-col items-center rounded-[8px] p-[5px] cursor-pointer transition-all duration-200 ease-in-out min-w-[85px] w-[calc(100%/7)] ${
                                        active === index
                                            ? "bg-slate-500"
                                            : "hover:bg-[#075D8E] "
                                    }`}
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
                                                        dayForecast.day
                                                            .mintemp_c
                                                    )}
                                                    °{" - "}
                                                    {Math.round(
                                                        dayForecast.day
                                                            .maxtemp_c
                                                    )}
                                                    °
                                                </>
                                            ) : (
                                                <>
                                                    {Math.round(
                                                        dayForecast.day
                                                            .mintemp_f
                                                    )}
                                                    °{" - "}
                                                    {Math.round(
                                                        dayForecast.day
                                                            .maxtemp_f
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
            </div>
        </div>
    );
};

export default WeatherInfo;
