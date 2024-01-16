import { useContext, useState } from "react";
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
    const {
        weather,
        setWeather,
        getData,
        setActive,
        temperatureUnit,
        setTemperatureUnit,
    } = useContext(TemperatureContext);

    const [newCity, setNewCity] = useState<string | null>(null);
    const [isCityToEdit, setIsCityToEdit] = useState<boolean>(false);

    const todayDate = {
        day: parseInt(weather?.location.localtime.split(" ")[0].split("-")[2]),
        month: parseInt(
            weather?.location.localtime.split(" ")[0].split("-")[1]
        ),
        year: weather?.location.localtime.split(" ")[0].split("-")[0],
    };

    const searchCity = () => {
        if (newCity) {
            setWeather(null);
            getData(newCity);
            setNewCity(null);
            setActive(0);
        }
    };

    const cancelSearching = (event: React.KeyboardEvent<HTMLInputElement>) => {
        (event.target as HTMLInputElement).blur();
        setNewCity(null);
        setIsCityToEdit(false);
    };

    return (
        <div className={`w-[100%] flex flex-col items-center`}>
            <div className={`flex flex-col gap-[10px]`}>
                <div
                    className={`flex transition duration-300 ease-in-out placeholder:text-gray-400 rounded-2xl border border-neutral-300 ${
                        isCityToEdit && "border-black"
                    }`}
                >
                    <input
                        type="email"
                        placeholder="Miejscowość"
                        className={`city__input bg-transparent py-[12px] pl-6 pr-20 text-[16px] text-gray-200 outline-none`}
                        value={newCity ? newCity : ""}
                        onFocus={() => setIsCityToEdit((prev) => !prev)}
                        onBlur={() => setIsCityToEdit((prev) => !prev)}
                        onChange={(event) => setNewCity(event.target.value)}
                        onKeyDown={(event) => {
                            event.code === "Enter" && searchCity();
                            event.code === "Escape" && cancelSearching(event);
                        }}
                    />
                    <div
                        className={`flex justify-center items-center border-l-[1px] w-[48px] aspect-square border-neutral-300 transition duration-300 ease-in-out ${
                            isCityToEdit && "border-black"
                        }`}
                    >
                        <Icon
                            icon="mdi:search"
                            width={36}
                            className={`cursor-pointer`}
                            onClick={() => searchCity()}
                        />
                    </div>
                </div>
                <div className={`text-[32px] text-center py-[12px]`}>
                    {city}
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
            </div>
        </div>
    );
};

export default DayInfo;
