import { SetStateAction, createContext, useEffect, useState } from "react";
import axios from "axios";
import DayInfo from "./Components/DayInfo";
import Loading from "./Assets/Loading";
import WeatherInfo from "./Components/WeatherInfo";
import DayDetails from "./Components/DayDetails";

interface TemperatureInterface {
    weather: any;
    temperatureUnit: string;
    setTemperatureUnit: React.Dispatch<SetStateAction<string>>;
    active: number;
    setActive: React.Dispatch<SetStateAction<number>>;
}

export const TemperatureContext = createContext<TemperatureInterface>(
    {} as TemperatureInterface
);

function App() {
    const API_KEY = "e9348d9812c5496f86f205401230411";
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

    const [city, setCity] = useState<string | null>(null);
    const [weather, setWeather] = useState<any>(null);
    const [temperatureUnit, setTemperatureUnit] = useState<string>("C");
    const [active, setActive] = useState<number>(0);

    async function getData(currentCity: string) {
        setCity(currentCity);
        const res = await axios.get(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${currentCity}&days=7&aqi=no&alerts=no`,
            { headers: headers }
        );
        setWeather(res.data);
    }

    const getUserCity = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                axios
                    .get(
                        `https://eu1.locationiq.com/v1/reverse?key=pk.634b9024bf19dacc9e07c3b9cfd5b589&lat=${lat}&lon=${lng}&format=json`
                    )
                    .then((res) => getData(res.data.address.village));
            },
            (error) => {
                console.log("API connection error:", error);
            }
        );
    };

    useEffect(() => {
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
    }, [city]);

    return (
        <div
            className={`flex flex-col gap-[40px] justify-center items-center w-[100%] h-[100%] bg-gradient-to-b from-sky-700 to-blue-950 p-[10px] relative text-slate-300`}
        >
            {!weather ? (
                <Loading />
            ) : (
                <TemperatureContext.Provider
                    value={{
                        weather,
                        temperatureUnit,
                        setTemperatureUnit,
                        active,
                        setActive,
                    }}
                >
                    <DayInfo city={city} />
                    <WeatherInfo />
                    <DayDetails />
                </TemperatureContext.Provider>
            )}
        </div>
    );
}

export default App;
