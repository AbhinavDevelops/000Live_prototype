import {
  List,
  MoonStars,
  PhoneDisconnect,
  PhonePause,
  Sun,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/utility/utils.ts";
import useGetGlobalData from "@/hooks/queries/useGetGlobalData.tsx";
import useTerminateCall from "@/hooks/mutations/useTerminateCall.tsx";

interface HackathonWinter24Props {}

export default function HackathonWinter24({}: HackathonWinter24Props) {
  const [isDark, setIsDark] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useGetGlobalData();

  const { mutate: terminateCall } = useTerminateCall();

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  };

  return (
    <div
      className={cn(
        "w-screen h-screen",
        "bg-primary-foreground transition-all duration-500 ease-out",
        isDark ? "dark bg-slate-900 saturate-[80%]" : "bg-white",
      )}
    >
      <div
        className={
          "flex flex-row items-center gap-4 px-6 h-[65px] w-screen transition-all duration-500 ease-out dark:bg-[#183B8F] bg-[#bdccff] text-primary"
        }
      >
        <List />
        <img
          className={"w-32"}
          src={`/assets/sirenscript-logo-${isDark ? "white" : "black"}.png`}
          alt="sirenscript logo"
        />
        <img
          className={cn("w-24 ml-auto", !isDark && "invert")}
          src="/assets/wadsih_logo.png"
          alt="wadsih logo"
        />
        <img
          className={"w-10"}
          src="/assets/wa_police.png"
          alt="wa police logo"
        />
        <Button
          className={"p-1.5"}
          variant={"ghost"}
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <MoonStars size={"1.5rem"} /> : <Sun size={"1.5rem"} />}
        </Button>
      </div>
      <div className={"flex flex-row w-screen h-[calc(100vh-65px)]"}>
        <div
          className={
            "flex flex-col flex-grow h-full justify-start items-start w-[36%] p-[1vw]"
          }
        >
          <div
            className={
              "flex flex-col min-h-[10vh] w-full flex-grow bg-slate-300 rounded-xl mb-[1vw] p-5"
            }
          >
            <p className={"text-lg font-medium"}>{formatTime(callDuration)}</p>
            <div className={"flex flex-row gap-2 w-full mt-auto"}>
              <Button className={"flex-grow"} variant={"secondary"}>
                <PhonePause size={"1.5rem"} />
              </Button>
              <Button
                className={"flex-grow"}
                variant={"destructive"}
                onClick={() => terminateCall()}
              >
                <PhoneDisconnect size={"1.5rem"} />
              </Button>
            </div>
          </div>
          <div
            className={cn(
              "flex flex-col gap-4 flex-grow h-[45vh] w-full p-5 rounded-xl transition-all duration-500 ease-out",
              "dark:bg-slate-700 dark:text-white bg-slate-300",
            )}
          >
            <h1 className={"text-xl mb-2"}>Caller Information</h1>
            <p>
              <span className={"font-bold"}>{"Phone Number: "}</span>
              <span>{"0498 284 475"}</span>
            </p>
            <p>
              <span className={"font-bold"}>{"Name: "}</span>
              <span>{"John Doe"}</span>
            </p>
            <p>
              <span className={"font-bold"}>{"AML Location: "}</span>
              <span>{"XXXXXX"}</span>
            </p>
            <p>
              <span className={"font-bold"}>{"Emergency Type: "}</span>
              <span>{"Ambulance/Police/Fire"}</span>
            </p>
            <p>
              <span className={"font-bold"}>{"Time of Call: "}</span>
              <span>{"XX:XX:XX DD:MM:YYYY"}</span>
            </p>
            <p>
              <span className={"font-bold"}>
                {"Previous Emergency History: "}
              </span>
              <span>
                {
                  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, similique?"
                }
              </span>
            </p>
          </div>
        </div>
        <div className={"w-[65vw] flex flex-col flex-grow h-full p-[1vw] pl-0"}>
          <div
            className={cn(
              "h-[55vw] p-5 rounded-xl transition-all duration-500 ease-out",
              "dark:bg-slate-700 dark:text-white bg-slate-300",
            )}
          >
            <h1 className={"text-xl mb-4"}>Active Transcript</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
              consequuntur est libero praesentium reprehenderit sint? Animi
              aperiam assumenda beatae consectetur corporis distinctio, dolores
              ea eveniet facere fugiat harum id iure obcaecati officia pariatur
              rem repellendus reprehenderit sequi similique veniam, vero.
            </p>
          </div>
          <div
            className={cn(
              "flex flex-col h-[42vw] flex-grow p-5 rounded-xl mt-[1vw]",
              "dark:bg-slate-700 dark:text-white bg-slate-300",
            )}
          >
            <h1 className={"text-xl mb-6"}>Crucial Information</h1>
            <ul className={"flex flex-col gap-3 list-disc ml-4"}>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
