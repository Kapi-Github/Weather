import {
    SetStateAction,
    createContext,
    useEffect,
    useRef,
    useState,
} from "react";
import axios from "axios";
import diacritics from "diacritics";
import Loading from "./Assets/Loading";
import DayInfo from "./Components/DayInfo";
import WeatherInfo from "./Components/WeatherInfo";
import DayDetails from "./Components/DayDetails/DayDetails";

interface TemperatureInterface {
    weather: any;
    temperatureUnit: string;
    setTemperatureUnit: React.Dispatch<SetStateAction<string>>;
    active: number;
    setActive: React.Dispatch<SetStateAction<number>>;
    setCityToEdit: React.Dispatch<SetStateAction<boolean>>;
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

    const cityInputRef = useRef<HTMLInputElement>(null);
    const [city, setCity] = useState<string | null>(
        localStorage.getItem("city")
    );
    const [weather, setWeather] = useState<any>(null);
    const [temperatureUnit, setTemperatureUnit] = useState<string>("C");
    const [active, setActive] = useState<number>(0);

    const [cityToEdit, setCityToEdit] = useState<boolean>(false);
    const [newCity, setNewCity] = useState<string | null>(null);

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
                console.log("API connection error:", error);
            }
        );
    }

    useEffect(() => {
        cityInputRef.current?.focus();
    }, [cityToEdit]);

    useEffect(() => {
        async function ip() {
            try {
                const response = await fetch(
                    "https://api.ipify.org?format=json"
                );
                const data = await response.json();
                const ipAddress = data.ip;
                console.log(ipAddress);
                return ipAddress;
            } catch (error) {
                console.error("Error fetching IP address:", error);
            }
        }
        ip();
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

    useEffect(() => {
        if (cityToEdit) {
            const handler = (event: MouseEvent) => {
                if (document.querySelector(".modal__bg") === event.target) {
                    setCityToEdit(false);
                }
            };

            addEventListener("click", handler);
            return () => {
                removeEventListener("click", handler);
            };
        }
    }, [cityToEdit]);

    const searchCity = () => {
        if (newCity) {
            getData(newCity);
            setNewCity(null);
            setActive(0);
            setCityToEdit((prev) => !prev);
        }
    };

    return (
        <div
            className={`flex flex-col gap-[40px] justify-center items-center w-[100%] h-[100%] p-[10px] relative text-slate-300 min-h-[100vh]`}
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
                        setCityToEdit,
                    }}
                >
                    <div
                        className={`${
                            cityToEdit ? "translate-y-[0%] " : ""
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
                                onClick={() => setCityToEdit((prev) => !prev)}
                            >
                                Anuluj
                            </button>
                        </div>
                    </div>
                    {cityToEdit && (
                        <div className="modal__bg h-screen w-screen opacity-30 absolute top-0 z-40 bg-[#3a3939]"></div>
                    )}
                    <DayInfo city={city} />
                    <WeatherInfo />
                    <DayDetails />
                </TemperatureContext.Provider>
            )}
        </div>
    );
}

export default App;
