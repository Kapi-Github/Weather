import { useContext } from "react";
import { TemperatureContext } from "../../../App";
import { Icon } from "@iconify/react";

interface Props {
    city: string | null;
}

export const months = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
];

const DayInfo = ({ city }: Props) => {
    const { weather, temperatureUnit, setTemperatureUnit, setIsCityToEdit } =
        useContext(TemperatureContext);

    const todayDate = {
        day: parseInt(weather?.location.localtime.split(" ")[0].split("-")[2]),
        month: parseInt(
            weather?.location.localtime.split(" ")[0].split("-")[1]
        ),
        year: weather?.location.localtime.split(" ")[0].split("-")[0],
    };

    return (
        <div className={`w-[100%] flex flex-col items-center`}>
            <div className={`flex`}>
                <div className={`text-[2.5rem] flex items-center gap-[10px]`}>
                    <span>{city}</span>
                    <hr className={`border-[1px] border-sky-900 h-[50%]`} />
                    <div className={`h-[100%] flex items-center`}>
                        <Icon
                            icon="mdi:search"
                            width={36}
                            className={`cursor-pointer`}
                            onClick={() => setIsCityToEdit((prev) => !prev)}
                        />
                    </div>
                </div>
            </div>
            <div className={`flex gap-[30px]`}>
                <div className={`flex justify-center items-center`}>
                    <strong className={`text-[20px]`}>
                        {weather.location.country}
                    </strong>
                </div>
                <div className={`flex justify-center items-center`}>
                    {todayDate.day} {months[todayDate.month - 1]}{" "}
                    {todayDate.year}
                </div>
            </div>
            <div className={`flex gap-[20px] h-[100px]`}>
                <div className={`flex justfiy-center items-center h-[100%]`}>
                    <img
                        src={`${weather.current.condition.icon}`}
                        alt="Weather icon"
                    />
                </div>
                <div
                    className={`font-thin flex justify-center items-center gap-[10px] h-[100%]`}
                >
                    <span className={`text-[4rem] min-w-[120px] text-center`}>
                        {temperatureUnit === "C"
                            ? Math.round(weather.current.temp_c)
                            : Math.round(weather.current.temp_f)}
                        °
                    </span>
                    <div className={`h-[100%] flex flex-col items-center`}>
                        <div
                            className={`h-[50%] flex justify-center items-center min-w-[40px]`}
                        >
                            <button
                                onClick={() => setTemperatureUnit("C")}
                                className={`px-[10px] transition-font duration-300 ease-out ${
                                    temperatureUnit === "C" &&
                                    "font-bold text-[1.2rem]"
                                }`}
                            >
                                C
                            </button>
                        </div>
                        <hr className={`w-[10px] border-slate-300`} />
                        <div
                            className={`h-[50%] flex justify-center items-center min-w-[40px]`}
                        >
                            <button
                                onClick={() => setTemperatureUnit("F")}
                                className={`px-[10px] transition-font duration-300 ease-out ${
                                    temperatureUnit === "F" &&
                                    "font-bold text-[1.4rem]"
                                }`}
                            >
                                F
                            </button>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default DayInfo;
