import React, { useEffect, useRef, useState, useContext } from "react";
import DayDetails from "./DayDetails/DayDetails";
import WeatherInfo from "./WeatherInfo";
import DayInfo from "./DayInfo";
import { TemperatureContext } from "../../App";

const MainSite = () => {
    const cityInputRef = useRef<HTMLInputElement>(null);

    const [newCity, setNewCity] = useState<string | null>(null);

    const { city, setActive, getData, isCityToEdit, setIsCityToEdit } =
        useContext(TemperatureContext);

    useEffect(() => {
        cityInputRef.current?.focus();

        if (isCityToEdit) {
            const handler = (event: MouseEvent) => {
                if (document.querySelector(".modal__bg") === event.target) {
                    setIsCityToEdit(false);
                }
            };

            addEventListener("click", handler);
            return () => {
                removeEventListener("click", handler);
            };
        }
    }, [isCityToEdit]);

    const searchCity = () => {
        if (newCity) {
            getData(newCity);
            setNewCity(null);
            setActive(0);
            setIsCityToEdit((prev) => !prev);
        }
    };

    return (
        <React.Fragment>
            <div
                className={`${
                    isCityToEdit ? "translate-y-[0%] " : ""
                }modal absolute top-0 translate-y-[-150%] rounded-b-[4px] bg-blue-950 transition-all duration-200 flex flex-col gap-[10px] items-center px-[5px] py-[10px] ease-in-out shadow-[0_0px_15px_0px_rgb(255,255,255)] text-white z-50`}
            >
                <input
                    type="text"
                    className={`bg-transparent outline-none text-center`}
                    placeholder={city ? city : ""}
                    value={newCity ? newCity : ""}
                    onChange={(event) => setNewCity(event.target.value)}
                    ref={cityInputRef}
                    onKeyDown={(event) =>
                        event.code === "Enter" && searchCity()
                    }
                />
                <hr className={`border-white w-[90%]`} />
                <div className={`flex`}>
                    <button
                        className={`bg-transparent rounded-[4px] hover:bg-[#1B2C62] transition-all duration-100 ease-in-out w-[100px]`}
                        onClick={() => searchCity()}
                    >
                        Szukaj
                    </button>
                    <button
                        className={`bg-transparent rounded-[4px] hover:bg-[#1B2C62] transition-all duration-100 ease-in-out w-[100px]`}
                        onClick={() => setIsCityToEdit((prev) => !prev)}
                    >
                        Anuluj
                    </button>
                </div>
            </div>
            {isCityToEdit ? (
                <div className="modal__bg h-screen w-screen opacity-30 absolute top-0 z-40 bg-[#3a3939]"></div>
            ) : null}
            <DayInfo city={city} />
            <WeatherInfo />
            <DayDetails />
        </React.Fragment>
    );
};

export default MainSite;
