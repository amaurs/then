import { useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}



export function useRequestAnimationFrame(animateCallback) {
  const requestAnimationFrameRef = useRef(animateCallback);

  useEffect(() => {
    const animate = () => {
        animateCallback();
        requestAnimationFrameRef.current = requestAnimationFrame(animate);
    }

    console.log("This should only run once.");
    
    requestAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => {
        console.log("Canceling animation.");
        cancelAnimationFrame(requestAnimationFrameRef.current)
    };
  }, []);
}
