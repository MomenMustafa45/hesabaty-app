/**
 * Runs after the current frame is painted (double rAF), optionally deferred via idle time.
 * Replaces InteractionManager.runAfterInteractions for bootsplash handoff.
 */
export function scheduleAfterFirstPaint(callback: () => void): void {
  const runAfterFrames = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  };

  const idle = (
    globalThis as typeof globalThis & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout?: number },
      ) => number;
    }
  ).requestIdleCallback;

  if (typeof idle === 'function') {
    idle(runAfterFrames, { timeout: 120 });
    return;
  }

  runAfterFrames();
}
