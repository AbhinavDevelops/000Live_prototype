import {
  List,
  MoonStars,
  Pause,
  PhoneDisconnect,
  PhoneOutgoing,
  PhonePause,
  PhoneSlash,
  Sun,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/utility/utils.ts";
import useGetGlobalData from "@/hooks/queries/useGetGlobalData.tsx";
import useTerminateCall from "@/hooks/mutations/useTerminateCall.tsx";
import {
  getHello,
  getSummary,
  getUpdatedTranscript,
  getUsers,
  restartCall,
} from "@/api/api.ts";
import { TranscriptionEntity } from "@/utility/types.ts";
import { Separator } from "@/components/ui/separator.tsx";

interface HackathonWinter24Props {}

export default function HackathonWinter24({}: HackathonWinter24Props) {
  const [isDark, setIsDark] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [updatedTranscript, setUpdatedTranscript] = useState("");
  const [summaryString, setSummaryString] = useState("");
  const [callTerminated, setCallTerminated] = useState(false);
  const [callOnHold, setCallOnHold] = useState(false);
  const [callTime, setCallTime] = useState(new Date());

  useGetGlobalData();

  const updateTranscript = () => {
    !callTerminated &&
      getUpdatedTranscript().then((response: TranscriptionEntity) => {
        console.log(response);
        !response.transcript.includes("Thank you") &&
          setUpdatedTranscript(
            (currentTranscript) => currentTranscript + response.transcript,
          );
      });
  };

  const updateSummary = (bypass = false) => {
    if (bypass || !callTerminated) {
      getSummary(updatedTranscript).then((response) => {
        setSummaryString(response);
      });
    }
  };

  useEffect(() => {
    const intervalId1 = setInterval(updateTranscript, 1750);
    // const intervalId2 = setInterval(updateSummary, 7000);
    return () => {
      clearInterval(intervalId1);
      // clearInterval(intervalId2);
    };
  }, []);

  useEffect(() => {
    const scrollableTranscriptBox = document.getElementById(
      "scrollableTranscriptBox",
    );
    if (!!scrollableTranscriptBox) {
      scrollableTranscriptBox.scrollTop = scrollableTranscriptBox.scrollHeight;
    }

    updateSummary();
  }, [updatedTranscript]);

  useEffect(() => {
    const scrollableSummaryBox = document.getElementById(
      "scrollableSummaryBox",
    );
    if (!!scrollableSummaryBox) {
      scrollableSummaryBox.scrollTop = scrollableSummaryBox.scrollHeight;
    }
  }, [summaryString]);

  const { mutate: terminateCall } = useTerminateCall();

  useEffect(() => {
    const updateCallDuration = () => {
      if (!callTerminated) {
        setCallDuration((prevTime) => prevTime + 1);
      } else {
        console.log({ callTerminated, callOnHold });
      }
    };
    restartCall();
    const interval = setInterval(updateCallDuration, 1000);

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
        <Button
          className={
            "ml-auto opacity-0 hover:opacity-0 hover:cursor-default w-24 h-full"
          }
          onClick={() => updateSummary(true)}
        ></Button>
        <img
          className={cn("w-24", !isDark && "invert")}
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
              "flex flex-col h-[10vh] w-full flex-grow bg-slate-300 rounded-xl mb-[1vw] px-5 py-4"
            }
          >
            <p
              className={cn(
                "text-lg font-medium",
                callOnHold && "animate-blink",
                callTerminated && "text-red-700",
              )}
            >
              {formatTime(callDuration)}
            </p>
            {callOnHold && (
              <p
                className={
                  "flex flex-row items-center gap-1.5 animate-blink font-extrabold mt-2 text-lg"
                }
              >
                <span>ON HOLD</span>
                <Pause />
              </p>
            )}
            {callTerminated && (
              <p
                className={
                  "flex flex-row items-center gap-1.5 animate-blink font-extrabold mt-2 text-lg text-red-700"
                }
              >
                <span>CALL TERMINATED</span>
                <PhoneSlash />
              </p>
            )}
            <div className={"flex flex-row gap-2 w-full mt-auto"}>
              <Button
                className={"flex-grow"}
                variant={callOnHold ? "default" : "secondary"}
                disabled={callTerminated}
                onClick={() => {
                  if (!callOnHold) {
                    terminateCall();
                    setCallOnHold(true);
                  } else {
                    restartCall();
                    setCallOnHold(false);
                  }
                }}
              >
                {!callOnHold ? (
                  <PhonePause size={"1.5rem"} />
                ) : (
                  <PhoneOutgoing size={"1.5rem"} />
                )}
              </Button>
              <Button
                className={"flex-grow"}
                variant={"destructive"}
                disabled={callTerminated}
                onClick={() => {
                  terminateCall();
                  setCallTerminated(true);
                }}
              >
                <PhoneDisconnect size={"1.5rem"} />
              </Button>
            </div>
          </div>
          <div
            className={cn(
              "flex flex-col flex-grow h-[45vh] w-full px-5 py-4 rounded-xl transition-all duration-500 ease-out",
              "dark:bg-slate-700 dark:text-white bg-slate-300",
            )}
          >
            <h1 className={"text-lg mb-2 font-semibold"}>Caller Data</h1>
            <Separator className={"bg-primary mb-4"} />

            <div className={"flex flex-col gap-4"}>
              <p>
                <span className={"font-bold"}>{"Phone Number: "}</span>
                <span>{"0498 284 475"}</span>
              </p>
              <p>
                <span className={"font-bold"}>{"Name: "}</span>
                <span>{"John Doe"}</span>
              </p>
              <p>
                <span className={"font-bold"}>{"Call Date: "}</span>
                <span>{new Date().toLocaleDateString()}</span>
              </p>
              <p>
                <span className={"font-bold"}>{"Call Time: "}</span>
                <span>{callTime.toLocaleTimeString()}</span>
              </p>
              <p>
                <span className={"font-bold"}>
                  {"Previous Emergency History: "}
                </span>
                <span>{"N/A"}</span>
              </p>
              <div>
                <p className={"font-bold"}>{"AML Location: "}</p>
                <p>{"McDonald's Hay St & William St, Perth WA 6000"}</p>
              </div>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d691.7490949715736!2d115.8568720133668!3d-31.953479909675455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32bad5cc842237%3A0xf0a59b566699439c!2sMcDonald&#39;s%20William%20Street!5e0!3m2!1sen!2sau!4v1719106375418!5m2!1sen!2sau"
              className={"mt-8 w-full h-full rounded-lg"}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        <div className={"w-[65vw] flex flex-col flex-grow h-full p-[1vw] pl-0"}>
          <div
            className={cn(
              "h-[55vw] px-5 py-4 rounded-xl transition-all duration-500 ease-out overflow-y-hidden",
              "dark:bg-slate-700 dark:text-white bg-slate-300",
            )}
          >
            <h1 className={"text-lg mb-2 font-semibold"}>Active Transcript</h1>
            <Separator className={"bg-primary mb-4"} />
            <div
              className={"h-full p-2 overflow-y-scroll scroll-smooth"}
              id={"scrollableTranscriptBox"}
            >
              <p className={""}>{updatedTranscript}</p>
            </div>
          </div>
          <div
            className={cn(
              "flex flex-col h-[42vw] flex-grow px-5 py-3 rounded-xl mt-[1vw]",
              "dark:bg-slate-700 dark:text-white bg-slate-300 overflow-y-hidden",
            )}
          >
            <h1 className={"text-lg font-semibold mb-2"}>
              Crucial Information
            </h1>
            <Separator className={"bg-primary mb-4"} />
            {/*<Button*/}
            {/*  className={"mb-4"}*/}
            {/*  onClick={() => getSummary().then((result) => console.log(result))}*/}
            {/*>*/}
            {/*  Summarise*/}
            {/*</Button>*/}
            <div
              className={"h-full overflow-y-scroll scroll-smooth"}
              id={"scrollableSummaryBox"}
            >
              <ul className={"flex flex-col gap-3 list-disc ml-4"}>
                {summaryString !== "" &&
                  (!summaryString.includes("ranscript") ||
                    !summaryString.includes("ready")) &&
                  summaryString
                    .split(".")
                    .slice(0, summaryString.split(".").length - 1)
                    .map((dotPoint, index) => {
                      return <li key={index}>{dotPoint}</li>;
                    })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
