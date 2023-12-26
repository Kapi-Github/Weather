import { Link, useLocation } from "react-router-dom";

interface Props {
    dayWeather: any;
}

const HoursList = ({ dayWeather }: Props) => {
    return (
        <div className={`flex flex-col items-center w-[100%] px-[10px]`}>
            {dayWeather.hour.map((hour: any, index: number) => (
                <div
                    key={index}
                    className={`w-[100%] cursor-pointer hover:bg-sky-800 hover:shadow-[0_0_20px_-12px_rgb(255,255,255)] transition-all duration-150 ease-in-out ${
                        index != 0
                            ? "border-t-[1px] border-t-white"
                            : "border-none"
                    }`}
                >
                    <Link
                        to={`${useLocation().pathname}/hour/${
                            hour.time.split(" ")[1].split(":")[0]
                        }`}
                    >
                        <div className={`p-[10px] flex gap-[10px]`}>
                            <div className={`text-[40px]`}>
                                {hour.time.split(" ")[1]}
                            </div>
                            <div className={`flex items-center flex-1 w-[30%]`}>
                                <div
                                    className={`flex justify-start items-center text-ellipsis whitespace-nowrap overflow-hidden w-[100%] `}
                                >
                                    {hour.condition.text}
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
