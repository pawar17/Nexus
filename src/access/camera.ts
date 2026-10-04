import type { FaceLandmarker as FaceLandmarkerT } from "@mediapipe/tasks-vision";
import type { CamCalibration, CamSource } from "@/lib/store";

/**
 * Camera tracking that runs entirely in the browser. Video frames go to
 * MediaPipe's face landmarker on the device; nothing is uploaded.
 *
 * Two pointing sources:
 *  - head: where the nose points within the face (turning the head moves the pointer)
 *  - eyes: where each iris sits between the eye corners and lids
 * Both produce a 2D feature that calibration maps to screen coordinates.
 */

const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export type Feature = { x: number; y: number };
type P = { x: number; y: number };

let landmarkerPromise: Promise<FaceLandmarkerT> | null = null;

const loadLandmarker = () => {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const files = await FilesetResolver.forVisionTasks(WASM);
      return FaceLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: MODEL, delegate: "GPU" },
        runningMode: "VIDEO",
        numFaces: 1,
      });
    })();
    landmarkerPromise.catch(() => {
      landmarkerPromise = null;
    });
  }
  return landmarkerPromise;
};

const ratio = (v: number, a: number, b: number) => (v - a) / (b - a || 1e-6);

/** Head: nose tip position within the face box, so turning (not shifting) the head points. */
const headFeature = (m: P[]): Feature => ({
  x: ratio(m[1].x, m[234].x, m[454].x),
  y: ratio(m[1].y, m[10].y, m[152].y),
});

/** Eyes: iris position between corners (x) and lids (y), averaged over both eyes. */
const eyeFeature = (m: P[]): Feature => {
  const r = { x: ratio(m[468].x, m[33].x, m[133].x), y: ratio(m[468].y, m[159].y, m[145].y) };
  const l = { x: ratio(m[473].x, m[362].x, m[263].x), y: ratio(m[473].y, m[386].y, m[374].y) };
  return { x: (r.x + l.x) / 2, y: (r.y + l.y) / 2 };
};

export class FaceTracker {
  private stream: MediaStream | null = null;
  private raf = 0;
  private smoothed: Feature | null = null;
  private stopped = false;

  constructor(
    private video: HTMLVideoElement,
    private source: CamSource,
    private onFeature: (f: Feature | null) => void,
  ) {}

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    });
    if (this.stopped) return this.stop();
    this.video.srcObject = this.stream;
    this.video.muted = true;
    this.video.playsInline = true;
    await this.video.play();
    const landmarker = await loadLandmarker();
    if (this.stopped) return;

    const alpha = this.source === "head" ? 0.35 : 0.2;
    let lastTime = -1;
    const loop = () => {
      if (this.stopped) return;
      if (this.video.readyState >= 2 && this.video.currentTime !== lastTime) {
        lastTime = this.video.currentTime;
        const res = landmarker.detectForVideo(this.video, performance.now());
        const m = res.faceLandmarks?.[0];
        if (m && m.length > 473) {
          const f = this.source === "head" ? headFeature(m) : eyeFeature(m);
          this.smoothed = this.smoothed
            ? { x: this.smoothed.x + alpha * (f.x - this.smoothed.x), y: this.smoothed.y + alpha * (f.y - this.smoothed.y) }
            : f;
          this.onFeature(this.smoothed);
        } else {
          this.smoothed = null;
          this.onFeature(null);
        }
      }
      this.raf = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.stopped = true;
    cancelAnimationFrame(this.raf);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }
}

/** Least-squares line through (feature, screen) pairs, one per axis. */
const fit = (fs: number[], ss: number[]) => {
  const n = fs.length;
  const mf = fs.reduce((a, b) => a + b, 0) / n;
  const ms = ss.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let varf = 0;
  for (let i = 0; i < n; i++) {
    cov += (fs[i] - mf) * (ss[i] - ms);
    varf += (fs[i] - mf) ** 2;
  }
  if (varf < 1e-7) return null;
  const a = cov / varf;
  return { a, b: ms - a * mf };
};

export function calibrate(
  samples: { screen: P; feature: Feature }[],
  source: CamSource,
): CamCalibration | null {
  const fx = fit(samples.map((s) => s.feature.x), samples.map((s) => s.screen.x));
  const fy = fit(samples.map((s) => s.feature.y), samples.map((s) => s.screen.y));
  if (!fx || !fy) return null;
  return { source, ax: fx.a, bx: fx.b, ay: fy.a, by: fy.b, w: innerWidth, h: innerHeight };
}

export const toScreen = (f: Feature, c: CamCalibration): P => {
  const sx = innerWidth / c.w;
  const sy = innerHeight / c.h;
  return {
    x: Math.min(innerWidth - 1, Math.max(0, (c.ax * f.x + c.bx) * sx)),
    y: Math.min(innerHeight - 1, Math.max(0, (c.ay * f.y + c.by) * sy)),
  };
};

/** Where the calibration dots go, as fractions of the viewport. */
export const CAL_POINTS: P[] = [
  { x: 0.5, y: 0.5 },
  { x: 0.12, y: 0.15 },
  { x: 0.88, y: 0.15 },
  { x: 0.12, y: 0.85 },
  { x: 0.88, y: 0.85 },
];
