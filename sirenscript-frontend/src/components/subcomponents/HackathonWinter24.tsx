import {
  Ambulance,
  List,
  MoonStars,
  Pause,
  PencilLine,
  Phone,
  PhoneDisconnect,
  PhoneOutgoing,
  PhonePause,
  PhoneSlash,
  PhoneTransfer,
  Sun,
  UserCircle,
} from "@phosphor-icons/react";
import { CSSProperties, useEffect, useState } from "react";
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
import { TranscriptEntry, TranscriptionEntity } from "@/utility/types.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { BounceLoader, ClipLoader } from "react-spinners";

interface HackathonWinter24Props {}

export default function HackathonWinter24({}: HackathonWinter24Props) {
  const [isDark, setIsDark] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [updatedTranscript, setUpdatedTranscript] = useState("");
  const [summaryString, setSummaryString] = useState("");
  const [callTerminated, setCallTerminated] = useState(false);
  const [callOnHold, setCallOnHold] = useState(false);
  const [callTime, _setCallTime] = useState(new Date());

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
    const intervalId1 = setInterval(updateTranscript, 1500);
    // const intervalId2 = setInterval(() => updateSummary(true), 7000);
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
      }
    };
    restartCall();
    const interval = setInterval(updateCallDuration, 1000);

    return () => clearInterval(interval);
  }, [callTerminated]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  };

  const override: CSSProperties = {
    marginBottom: "0.5rem",
  };

  return (
    <div
      className={cn(
        "w-screen h-screen",
        "bg-primary-foreground transition-all duration-500 ease-out",
        isDark ? "dark bg-slate-900" : "bg-white",
      )}
    >
      <div
        className={
          "flex flex-row items-center gap-4 px-6 h-[65px] w-screen transition-all duration-500 ease-out dark:bg-[#183B8F] bg-sky-200 saturate-[90%] text-primary"
        }
      >
        <List size={"1.6rem"} />
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
              "flex flex-col h-[4vh] w-full flex-grow bg-slate-300 rounded-xl mb-[1vw] px-5 py-4 shadow-md"
            }
          >
            <p
              className={cn(
                "text-lg font-medium",
                // callOnHold && "animate-blink",
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
            {!callOnHold && !callTerminated && (
              <p
                className={
                  "flex flex-row items-center gap-1.5 font-extrabold mt-2 text-lg"
                }
              >
                <span>CALL ACTIVE</span>
                <Phone />
              </p>
            )}
            {callTerminated && (
              <p
                className={
                  "flex flex-row items-center gap-1.5 animate-blink font-extrabold mt-2 text-lg text-red-700 "
                }
              >
                <span>CALL TERMINATED</span>
                <PhoneSlash />
              </p>
            )}
            <div className={"flex flex-row gap-2 w-full mt-auto"}>
              <Button
                className={cn("flex-grow")}
                variant={callOnHold ? "secondary" : "default"}
                disabled={callTerminated}
                onClick={() => {}}
              >
                <PhoneTransfer size={"1.5rem"} />
              </Button>
              <Button
                className={cn("flex-grow")}
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
                  <PhonePause
                    className={cn(callOnHold && "animate-pulse")}
                    size={"1.5rem"}
                  />
                ) : (
                  <PhoneOutgoing size={"1.5rem"} />
                )}
              </Button>
              <Button
                className={"flex-grow"}
                variant={"destructive"}
                disabled={callTerminated}
                onClick={() => {
                  setCallTerminated(true);
                  terminateCall();
                }}
              >
                <PhoneDisconnect size={"1.5rem"} />
              </Button>
            </div>
          </div>
          <div
            className={cn(
              "flex flex-col flex-grow h-[55vh] w-full px-5 py-4 rounded-xl transition-all duration-500 ease-out shadow-md",
              "dark:bg-slate-700 dark:text-white bg-slate-200",
            )}
          >
            <div className={"flex flex-row items-center gap-2 mb-2"}>
              <p className={"text-lg font-semibold"}>Caller Data</p>
              <UserCircle size={"1.2rem"} />
            </div>
            <Separator className={"bg-primary mb-6"} />

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
                <p className={"font-bold"}>{"AML Caller Location: "}</p>
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
              "h-[55vw] px-5 py-4 rounded-xl transition-all duration-500 ease-out overflow-y-hidden shadow-md",
              "dark:bg-slate-700 dark:text-white bg-cyan-300 saturate-[10%] dark:saturate-100",
            )}
          >
            <div className={"flex flex-row items-center gap-2 mb-2"}>
              <p className={"text-lg font-semibold"}>Active Transcript</p>
              <PencilLine size={"1.2rem"} />
            </div>
            <Separator className={"bg-primary mb-4"} />
            <div
              className={"h-full p-2 overflow-y-scroll scroll-smooth"}
              id={"scrollableTranscriptBox"}
            >
              <p className={""}>{updatedTranscript}</p>
              {/*{transcriptArray.map((transcriptItem, key) => (*/}
              {/*  <div key={key} className={"mb-4"}>*/}
              {/*    <p className={"font-light"}>*/}
              {/*      {transcriptItem.timestamp.toLocaleTimeString()}*/}
              {/*    </p>*/}
              {/*    <p className={"font-medium"}>{transcriptItem.transcript}</p>*/}
              {/*  </div>*/}
              {/*))}*/}
            </div>
          </div>
          <div
            className={cn(
              "flex flex-col h-[42vw] flex-grow px-5 py-3 rounded-xl mt-[1vw] shadow-md",
              "bg-slate-300 overflow-y-hidden",
            )}
          >
            <div className={"flex flex-row items-center gap-2 mb-2"}>
              <p className={"text-lg font-semibold"}>Crucial Information</p>
              <Ambulance size={"1.2rem"} />
            </div>
            <Separator className={"bg-background mb-4"} />
            <div
              className={
                "flex flex-row items-start justify-start h-full overflow-y-scroll scroll-smooth"
              }
              id={"scrollableSummaryBox"}
            >
              <ul
                className={
                  "flex flex-col gap-3 list-disc ml-6 mr-4 font-medium text-base"
                }
              >
                {summaryString !== "" &&
                  (!summaryString.includes("ranscript") ||
                    !summaryString.includes("ready")) &&
                  summaryString
                    .split(".")
                    .slice(0, summaryString.split(".").length - 1)
                    .map((dotPoint, index) => {
                      return (
                        <li
                          key={index}
                          className={cn(
                            dotPoint.includes("Department") &&
                              "font-extrabold text-red-700 animate-pulse duration-[1900ms]",
                            summaryString.includes(
                              "Awaiting key information",
                            ) && "animate-pulse",
                          )}
                        >
                          {summaryString.includes("Awaiting key information")
                            ? dotPoint + "..."
                            : dotPoint + "."}
                        </li>
                      );
                    })}
              </ul>
              {summaryString.includes("Awaiting key information") && (
                <BounceLoader
                  color={"#183B8F"}
                  loading={true}
                  cssOverride={override}
                  size={"1.65rem"}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
