import { useEffect, useRef, useState } from "react";
import { useNexus } from "@/lib/store";
import { speak } from "@/lib/speech";
import { createDwell, targetAt } from "./dwell";
import { FaceTracker, calibrate, toScreen, CAL_POINTS, type Feature } from "./camera";

type Status = "starting" | "calibrating" | "tracking" | "noface" | "error";

const SETTLE_MS = 800;
const SAMPLE_MS = 1100;

/**
 * Camera input: a webcam tracks the child's head or eyes, moves an on-screen
 * pointer, and dwell selects whatever tile the pointer rests on.
 */
export function CameraLayer({ active }: { active: boolean }) {
  const { settings, update } = useNexus();
  const { camSource, camCal, camPreview, dwellMs } = settings;
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("starting");
  const [error, setError] = useState("");
  const [calIndex, setCalIndex] = useState(0);
  const [recal, setRecal] = useState(0);

  // Latest values for the frame loop without restarting the camera
  const live = useRef({ cal: camCal, dwellMs, calibrating: false });
  live.current.cal = camCal && camCal.source === camSource ? camCal : null;
  live.current.dwellMs = dwellMs;

  const forceCal = useRef(false);

  useEffect(() => {
    if (!active) return;
    const video = videoRef.current!;
    const dwell = createDwell(() => live.current.dwellMs);
    const samples: { screen: { x: number; y: number }; feature: Feature }[] = [];
    let collecting: Feature[] = [];
    let calibrating = !live.current.cal || forceCal.current;
    forceCal.current = false;
    let point = 0;
    let calTimers: number[] = [];
    let missed = 0;

    const runCalibration = () => {
      calibrating = true;
      live.current.calibrating = true;
      setStatus("calibrating");
      samples.length = 0;
      point = 0;
      speak(camSource === "head" ? "Point your nose at each dot" : "Look at each dot");
      const next = () => {
        if (point >= CAL_POINTS.length) {
          const cal = calibrate(samples, camSource);
          calibrating = false;
          live.current.calibrating = false;
          if (cal) {
            update({ camCal: cal });
            setStatus("tracking");
            speak("All set");
          } else {
            setError("Calibration didn't pick up enough movement. Try again, turning a little further toward each dot.");
            setStatus("error");
          }
          return;
        }
        setCalIndex(point);
        collecting = [];
        calTimers.push(
          window.setTimeout(() => {
            collecting = [];
            calTimers.push(
              window.setTimeout(() => {
                if (collecting.length >= 5) {
                  const avg = collecting.reduce((a, f) => ({ x: a.x + f.x, y: a.y + f.y }), { x: 0, y: 0 });
                  samples.push({
                    screen: { x: CAL_POINTS[point].x * innerWidth, y: CAL_POINTS[point].y * innerHeight },
                    feature: { x: avg.x / collecting.length, y: avg.y / collecting.length },
                  });
                }
                collecting = [];
                point += 1;
                next();
              }, SAMPLE_MS),
            );
          }, SETTLE_MS),
        );
      };
      next();
    };

    const onFeature = (f: Feature | null) => {
      if (!f) {
        missed += 1;
        if (missed > 15 && !calibrating) {
          setStatus("noface");
          dwell.clear();
          if (cursorRef.current) cursorRef.current.style.opacity = "0";
        }
        return;
      }
      missed = 0;
      if (calibrating) {
        collecting.push(f);
        return;
      }
      const cal = live.current.cal;
      if (!cal) return;
      setStatus((s) => (s === "tracking" ? s : "tracking"));
      const p = toScreen(f, cal);
      const c = cursorRef.current;
      if (c) {
        c.style.opacity = "1";
        c.style.transform = `translate(${p.x}px, ${p.y}px)`;
      }
      dwell.hover(targetAt(p.x, p.y));
      // Looking near the top or bottom edge scrolls long screens
      const edge = innerHeight * 0.08;
      if (p.y > innerHeight - edge) window.scrollBy(0, 8);
      else if (p.y < edge) window.scrollBy(0, -8);
    };

    const tracker = new FaceTracker(video, camSource, onFeature);
    setStatus("starting");
    setError("");
    tracker
      .start()
      .then(() => {
        if (calibrating) runCalibration();
        else setStatus("tracking");
      })
      .catch((err: unknown) => {
        const name = err instanceof DOMException ? err.name : "";
        setError(
          name === "NotAllowedError"
            ? "Camera access was blocked. Allow the camera for this site in your browser, then try again."
            : name === "NotFoundError"
              ? "No camera was found on this device."
              : "Couldn't start face tracking. Check your connection and try again.",
        );
        setStatus("error");
      });

    return () => {
      calTimers.forEach(clearTimeout);
      calTimers = [];
      tracker.stop();
      dwell.clear();
      live.current.calibrating = false;
    };
    // Restart the camera when the source changes or a recalibration is requested
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, camSource, recal]);

  if (!active) return null;

  const dot = CAL_POINTS[calIndex];

  return (
    <>
      <div ref={cursorRef} className="cam-cursor" aria-hidden style={{ opacity: 0 }} />

      {status === "calibrating" && (
        <div className="cal-overlay" data-allow-click>
          <p className="cal-text">
            {camSource === "head" ? "Point your nose at the dot" : "Look at the dot"} · {calIndex + 1} of {CAL_POINTS.length}
          </p>
          <div key={calIndex} className="cal-dot" style={{ left: `${dot.x * 100}%`, top: `${dot.y * 100}%` }} />
        </div>
      )}

      <div className={`cam-panel ${camPreview ? "" : "compact"}`} data-allow-click>
        <video ref={videoRef} className="cam-video" style={{ display: camPreview ? "block" : "none" }} />
        <div className="cam-status">
          <span className={`cam-dot ${status}`} />
          {status === "starting" && "Starting camera…"}
          {status === "calibrating" && "Calibrating"}
          {status === "tracking" && (camSource === "head" ? "Head tracking" : "Eye tracking")}
          {status === "noface" && "Can't see a face"}
          {status === "error" && "Camera off"}
        </div>
        {(status === "tracking" || status === "noface" || status === "error") && (
          <button
            className="cam-btn"
            onClick={() => {
              forceCal.current = status !== "error" || !live.current.cal;
              setRecal((n) => n + 1);
            }}
          >
            {status === "error" ? "Try again" : "Recalibrate"}
          </button>
        )}
        {error && <p className="cam-error">{error}</p>}
        <p className="cam-privacy">Video stays on this device.</p>
      </div>
    </>
  );
}
