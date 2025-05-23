"use client";
import React, { useEffect, useRef, useState } from "react";

type TimerState = "stopped" | "running" | "paused";

const INITIAL_TIME = 5 * 60; // 5 minutes in seconds - you can adjust

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Home() {
  const [time1, setTime1] = useState(INITIAL_TIME);
  const [time2, setTime2] = useState(INITIAL_TIME);
  const [activePlayer, setActivePlayer] = useState<1 | 2 | null>(null); // who is counting down
  const [timerStatus, setTimerStatus] = useState<TimerState>("stopped");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerStatus === "running" && activePlayer) {
      timerRef.current = setInterval(() => {
        if (activePlayer === 1) {
          setTime1((t) => {
            if (t <= 1) {
              clearInterval(timerRef.current!);
              setTimerStatus("stopped");
              setActivePlayer(null);
              alert("Player 1's time ran out!");
              return 0;
            }
            return t - 1;
          });
        } else if (activePlayer === 2) {
          setTime2((t) => {
            if (t <= 1) {
              clearInterval(timerRef.current!);
              setTimerStatus("stopped");
              setActivePlayer(null);
              alert("Player 2's time ran out!");
              return 0;
            }
            return t - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerStatus, activePlayer]);

  const start = () => {
    if (timerStatus === "stopped") {
      setActivePlayer(1);
      setTimerStatus("running");
    } else if (timerStatus === "paused") {
      setTimerStatus("running");
    }
  };

  const pause = () => {
    setTimerStatus("paused");
  };

  const reset = () => {
    setTimerStatus("stopped");
    setActivePlayer(null);
    setTime1(INITIAL_TIME);
    setTime2(INITIAL_TIME);
  };

  const switchTurn = () => {
    if (timerStatus !== "running") return;
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center text-white font-sans p-6">
      <h1 className="text-4xl font-bold mb-8">Chess Match Timer</h1>

      <div className="flex space-x-12 mb-8 w-full max-w-xl">
        {/* Player 1 Timer */}
        <div
          className={`flex-1 p-6 rounded-lg cursor-pointer select-none 
          ${
            activePlayer === 1 && timerStatus === "running"
              ? "bg-green-700"
              : "bg-gray-800"
          }
          transition-colors duration-300
          `}
          onClick={() => {
            if (timerStatus === "running" && activePlayer === 1) switchTurn();
          }}
        >
          <h2 className="text-2xl mb-2">Player 1</h2>
          <p className="text-5xl font-mono text-center">{formatTime(time1)}</p>
        </div>

        {/* Player 2 Timer */}
        <div
          className={`flex-1 p-6 rounded-lg cursor-pointer select-none 
          ${
            activePlayer === 2 && timerStatus === "running"
              ? "bg-green-700"
              : "bg-gray-800"
          }
          transition-colors duration-300
          `}
          onClick={() => {
            if (timerStatus === "running" && activePlayer === 2) switchTurn();
          }}
        >
          <h2 className="text-2xl mb-2">Player 2</h2>
          <p className="text-5xl font-mono text-center">{formatTime(time2)}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-x-4">
        {(timerStatus === "stopped" || timerStatus === "paused") && (
          <button
            onClick={start}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
          >
            {timerStatus === "paused" ? "Resume" : "Start"}
          </button>
        )}
        {timerStatus === "running" && (
          <button
            onClick={pause}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold transition"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
        >
          Reset
        </button>
      </div>

      <p className="mt-6 text-gray-400 text-center max-w-sm">
        Click on the active player’s timer to switch turns.
      </p>
    </div>
  );
}
