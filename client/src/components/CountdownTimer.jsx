import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

function getSecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight - now) / 1000);
}

function CountdownTimer() {
  const { isAdmin } = useAuth();
  const [remaining, setRemaining] = useState(getSecondsUntilMidnight);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining(() => {
        const secs = getSecondsUntilMidnight();
        if (secs <= 0) {
          toast("🔥 Sales ended! Restarting...", { icon: "⏰" });
          return getSecondsUntilMidnight();
        }
        return secs;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (!paused) startInterval();
    return () => clearInterval(intervalRef.current);
  }, [paused, startInterval]);

  const handlePause = () => setPaused((p) => !p);
  const handleReset = () => {
    setRemaining(getSecondsUntilMidnight());
    setPaused(false);
  };

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <div className="w-full flex flex-row items-center justify-center gap-3 px-4 py-2 rounded-xl bg-base-200">
      <h2 className="text-lg font-bold text-white">Sales end in</h2>
      <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
        <div className="flex flex-col items-center px-3 py-1.5 bg-neutral rounded-box text-white">
          <span className="font-mono text-2xl">{String(days).padStart(2, "0")}</span>
          <span className="text-xs">days</span>
        </div>
        <div className="flex flex-col items-center px-3 py-1.5 bg-neutral rounded-box text-white">
          <span className="font-mono text-2xl">{String(hours).padStart(2, "0")}</span>
          <span className="text-xs">hours</span>
        </div>
        <div className="flex flex-col items-center px-3 py-1.5 bg-neutral rounded-box text-white">
          <span className="font-mono text-2xl">{String(minutes).padStart(2, "0")}</span>
          <span className="text-xs">min</span>
        </div>
        <div className="flex flex-col items-center px-3 py-1.5 bg-neutral rounded-box text-white">
          <span className="font-mono text-2xl">{String(seconds).padStart(2, "0")}</span>
          <span className="text-xs">sec</span>
        </div>
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          <button className="btn btn-outline btn-primary btn-sm sm:btn-md" onClick={handlePause}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button className="btn btn-outline btn-secondary btn-sm sm:btn-md" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default CountdownTimer;
