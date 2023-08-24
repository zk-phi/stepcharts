import React from "react";
import ChartPreview from "./ChartPreview";

const useAnimationFrame = (callback = () => {}) => {
  const reqIdRef = React.useRef<number>();
  const loop = () => {
    reqIdRef.current = requestAnimationFrame(loop);
    callback();
  };

  React.useEffect(() => {
    reqIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    }
  }, []);
};

const PreviewPage = ({ chart }: {
  chart: Stepchart,
}) => {
  const startTime = React.useMemo(() => (new Date()).getTime(), []);
  const [sec, setSec] = React.useState(0);

  useAnimationFrame(() => {
    setSec(((new Date()).getTime() - startTime) / 1000);
  });

  return (
    <ChartPreview chart={chart} speed={2.5} time={sec} />
  );
};

export default PreviewPage;
