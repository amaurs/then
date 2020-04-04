import { useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
  const savedCallback = useRef();
  const intervalRef = useRef();

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
      intervalRef.current = setInterval(tick, delay);
      return () => clearInterval(intervalRef.current);
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
  }, [animateCallback]);
}


export function useTimeout(callback, delay) {
    const savedCallback = useRef();
    const timeoutRef = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {

        if (delay !== null) {
            timeoutRef.current = setTimeout(() => {
                savedCallback.current();
            }, delay);

            return () => clearTimeout(timeoutRef.current);
        }
    }, [delay]);

}
