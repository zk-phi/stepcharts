import React from "react";

export const useAnimationFrame = (callback = () => {}) => {
  const reqIdRef = React.useRef<number>();

  React.useEffect(() => {
    const loop = () => {
      reqIdRef.current = requestAnimationFrame(loop);
      callback();
    };
    reqIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    }
  }, [callback]);
};
