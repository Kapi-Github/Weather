import { useParams } from "react-router-dom";
import { useContext } from "react";
import { TemperatureContext } from "../../App";
import { convertDate } from "../Main/DayDetails/DayDetails";
import { months } from "../Main/DayInfo";

const DayDetailsSite = () => {
    const { date } = useParams();
    const { weather, city } = useContext(TemperatureContext);

    const [dayWeather] = weather.forecast.forecastday.filter(
        (day: any) => day.date === date
    );

    console.log(dayWeather);

    const { day, month, year } = convertDate(dayWeather.date);

    return (
        <div className={`w-[100%] h-[100%]`}>
            <div
                className={`flex flex-col justify-center items-stretch gap-[5px]`}
            >
                <span
                    className={`text-[3.5rem] flex justify-center items-center`}
                >
                    {city}
                </span>{" "}
                <div className={`flex gap-[30px] justify-center`}>
                    <span
                        className={`text-[1.5rem] flex justify-center items-center`}
                    >
                        {weather.location.country}
                    </span>
                    <div className={`w-[1px] bg-black`}></div>
                    <span
                        className={`text-[1.5rem] flex justify-center items-center`}
                    >
                        {day} {months[month - 1]} {year}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DayDetailsSite;
