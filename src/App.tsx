import { SetStateAction, createContext, useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Outlet } from "react-router-dom";
import diacritics from "diacritics";
import Loading from "./Assets/Loading";
import DayDetailsSite from "./Components/Date/DayDetailsSite";
import MainSite from "./Components/Main/MainSite";
import NotFound from "./Components/NotFound/NotFound";
import HourDetailsSite from "./Components/Date/Hour/HourDetailsSite";

interface TemperatureInterface {
    city: string | null;
    weather: any;
    setWeather: React.Dispatch<SetStateAction<any>>;
    temperatureUnit: string;
    setTemperatureUnit: React.Dispatch<SetStateAction<string>>;
    active: number;
    setActive: React.Dispatch<SetStateAction<number>>;
    getData: (city: string) => void;
    isCityToEdit: boolean;
    setIsCityToEdit: React.Dispatch<SetStateAction<boolean>>;
}

export const TemperatureContext = createContext<TemperatureInterface>(
    {} as TemperatureInterface
);

interface Props {
    apikey: string;
}

function App(props: Props) {
    const headers = {
        Vary: "Accept-Encoding",
        "CDN-PullZone": "93447",
        "CDN-Uid": "8fa3a04a-75d9-4707-8056-b7b33c8ac7fe",
        "CDN-RequestCountryCode": "GB",
        Age: "0",
        "x-weatherapi-qpm-left": "5000000",
        "CDN-ProxyVer": "1.04",
        "CDN-RequestPullSuccess": "True",
        "CDN-RequestPullCode": "200",
        "CDN-CachedAt": "11/04/2023 20:59:44",
        "CDN-EdgeStorageId": "1077",
        "CDN-Status": "200",
        "CDN-RequestId": "2ea57692056617139ae14354cbf368af",
        "CDN-Cache": "MISS",
        "Cache-Control": "public, max-age=180",
        "Content-Type": "application/json",
        Server: "BunnyCDN-DE1-860",
    };

    const [city, setCity] = useState<string | null>(
        localStorage.getItem("city")
    );

    const [isCityToEdit, setIsCityToEdit] = useState<boolean>(false);

    const [weather, setWeather] = useState<any>(null);
    const [temperatureUnit, setTemperatureUnit] = useState<string>("C");
    const [active, setActive] = useState<number>(0);

    async function getData(currentCity: string) {
        currentCity = diacritics.remove(currentCity);
        const res = await axios.get(
            `https://api.weatherapi.com/v1/forecast.json?key=${props.apikey}&q=${currentCity}&days=7&aqi=no&alerts=no&lang=pl`,
            { headers: headers }
        );

        if (res.status === 200) {
            setCity(currentCity);
            localStorage.setItem("city", currentCity);
            setWeather(res.data);
        } else {
            throw new Error("API connection error");
        }
    }

    function getUserCity() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    let lat = position.coords.latitude;
                    let lng = position.coords.longitude;

                    const res = await axios.get(
                        `https://eu1.locationiq.com/v1/reverse?key=pk.634b9024bf19dacc9e07c3b9cfd5b589&lat=${lat}&lon=${lng}&format=json&normalizeaddress=1&accept-language=en`
                    );

                    if (res.status === 200) {
                        getData(res.data.address.city);
                    } else {
                        getData("London");
                    }
                },
                (error) => {
                    console.log(
                        "API connection error:",
                        error,
                        "Nie mozna pobrac lokalizacji"
                    );
                }
            );
        } else {
            //not supported by this browser
        }
    }

    useEffect(() => {
        if (city) {
            getData(city);
        } else {
            navigator.permissions
                .query({ name: "geolocation" })
                .then((permissions) => {
                    switch (permissions.state) {
                        case "denied":
                            getData("London");
                            break;
                        case "granted":
                            getUserCity();
                            break;
                        default:
                            getData("London");
                    }

                    permissions.addEventListener("change", () => {
                        setWeather(null);
                        switch (permissions.state) {
                            case "denied":
                                getData("London");
                                break;
                            case "granted":
                                getUserCity();
                                break;
                        }
                    });
                });
        }
    }, [city]);

    return (
        <div
            className={`flex flex-col gap-[40px] justify-center items-center w-[100%] h-[100%] p-[10px] relative text-slate-300 min-h-[100vh]`}
        >
            {!weather ? (
                <Loading />
            ) : (
                <TemperatureContext.Provider
                    value={{
                        city,
                        weather,
                        setWeather,
                        temperatureUnit,
                        setTemperatureUnit,
                        active,
                        setActive,
                        getData,
                        isCityToEdit,
                        setIsCityToEdit,
                    }}
                >
                    <Routes>
                        <Route path={`/`} element={<MainSite />} />

                        <Route path={"date/:date"} element={<Outlet />}>
                            <Route index element={<DayDetailsSite />} />
                            <Route
                                path={`hour/:hour`}
                                element={<HourDetailsSite />}
                            />
                        </Route>
                        <Route path={`*`} element={<NotFound />} />
                    </Routes>
                </TemperatureContext.Provider>
            )}
        </div>
    );
}

export default App;
