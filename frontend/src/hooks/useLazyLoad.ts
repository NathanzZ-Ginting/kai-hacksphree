// hooks/useLazyLoad.ts
import { useEffect, useRef, useState } from "react";

export const useLazyLoad = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
};

// utils/imageOptimization.ts
export const optimizeImage = (src: string, width: number = 800) => {
  return `${src}?width=${width}&format=webp`;
};
