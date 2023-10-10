import React from "react";

export const useAnimationFrame = (callback = () => {}, deps) => {
  const reqIdRef = React.useRef<number>();
  const cb = React.useCallback(callback, deps);

  React.useEffect(() => {
    const loop = () => {
      reqIdRef.current = requestAnimationFrame(loop);
      cb();
    };
    reqIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    }
  }, [cb]);
};
