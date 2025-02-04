import { useState, useRef, useEffect } from "react";

const SHOW_CLUES = false;
const levels = [
  {
    differences: [
      { x: 312, y: 50, radius: 28 },
      { x: 173, y: 141.5, radius: 15 },
      { x: 235, y: 269.5, radius: 25 },
    ],
  },
  {
    differences: [
      { x: 70, y: 137.5, radius: 20 },
      { x: 54, y: 350.5, radius: 18 },
      { x: 387, y: 378.5, radius: 20 },
    ],
  },
  {
    differences: [
      { x: 301, y: 71.5, radius: 20 },
      { x: 253, y: 108.5, radius: 25 },
      { x: 392, y: 299.5, radius: 15 },
      { x: 213, y: 293.5, radius: 15 },
    ],
  }
];

export default function SpotTheDifference() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [found, setFound] = useState(SHOW_CLUES ? levels[levelIndex].differences.map((_, i) => i) : []);
  const [timeLeft, setTimeLeft] = useState(120);
  const currentLevel = levels[levelIndex];
  const imgRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    initialWidth: null,
    initialHeight: null,
    currentWidth: null,
    currentHeight: null,
  });
  useEffect(() => {
    const updateDimensions = () => {
      if (imgRef.current) {
        setDimensions((prev) => {
          const newDims = {
            ...prev,
            currentWidth: imgRef.current.clientWidth,
            currentHeight: imgRef.current.clientHeight,
          };
          console.log("Updated Dimensions:", newDims);
          return newDims;
        });
      }
    };

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const handleImageLoad = () => {
    if (imgRef.current) {
      const newDims = {
        initialWidth: imgRef.current.naturalWidth,
        initialHeight: imgRef.current.naturalHeight,
        currentWidth: imgRef.current.clientWidth,
        currentHeight: imgRef.current.clientHeight,
      };
      console.log("Initial & Current Dimensions on Load:", newDims);
      setDimensions(newDims);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);
  
  const handleTap = (event) => {

  
    const rect = event.target.getBoundingClientRect();
    
    // Get raw click/tap coordinates relative to the image
    const rawX = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
    const rawY = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
  
    // Scale factors to map from current size to initial size
    const scaleX = 400 / dimensions.currentWidth;
    const scaleY = 400 / dimensions.currentHeight;
  
    // Adjust coordinates to match the original image dimensions
    const x = rawX * scaleX;
    const y = rawY * scaleY;
  
    console.log(`{ x: ${x}, y: ${y}, radius: 15 }`);
  
    currentLevel.differences.forEach((diff, index) => {
      const dx = x - diff.x;
      const dy = y - diff.y;
      if (Math.sqrt(dx * dx + dy * dy) < diff.radius) {
        setFound((prev) => (prev.includes(index) ? prev : [...prev, index]));
      }
    });
  };
  

  useEffect(() => {
    if (found.length === currentLevel.differences.length) {
      setTimeout(() => {
        setLevelIndex((prev) => (prev + 1) % levels.length);
        setFound([]);
        setTimeLeft(120);
      }, 3000);
    }
  }, [found]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-row items-end">
        <img src='/logo.png' alt="progress indicator" className="w-12 h-12 mr-2 sm:w-20 sm:h-20 sm:mr-5" />
        <p className="text-3xl sm:text-6xl font-bold">PHOTOHUNT</p>
      </div>
      <p>Level: {levelIndex + 1}/{levels.length}</p>
      {found.length === currentLevel.differences.length ? (
        <p className="text-green-500">Level Complete!</p>
      ) : (
        <p>Time Left: {timeLeft}s</p>
      )}
      <div className="flex gap-2 mt-2">
        {currentLevel.differences.map((_, index) => (
          <img
            key={index}
            src='/foundicon.png'
            alt="progress indicator"
            className={`w-10 h-10 transition-opacity duration-500 ${found.includes(index) ? "opacity-100" : "opacity-20 grayscale"}`}
          />
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="relative border p-2" onClick={handleTap} onTouchStart={handleTap}>
          <img ref={imgRef} onLoad={handleImageLoad} src={`/levels/${levelIndex}/original.png`} alt="Original" className="w-[400px]" />
          {found.map((index) => {
  const diff = currentLevel.differences[index];

  // Scale factors based on initial and current image dimensions
  const scaleX = dimensions.currentWidth / 400;
  const scaleY = dimensions.currentHeight / 400;

  return (
    <div
      key={index}
      className="absolute bg-red-500 opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2"
      style={{
        width: `${diff.radius * 2 * scaleX}px`,
        height: `${diff.radius * 2 * scaleY}px`,
        top: `${diff.y * scaleY}px`,
        left: `${diff.x * scaleX}px`,
      }}
    ></div>
  );
})}
        </div>
        <div className="relative border p-2" onClick={handleTap} onTouchStart={handleTap}>
          <img ref={imgRef} onLoad={handleImageLoad} src={`/levels/${levelIndex}/modified.png`} alt="Modified" className="w-[400px]" />
          {found.map((index) => {
  const diff = currentLevel.differences[index];

  // Scale factors based on initial and current image dimensions
  const scaleX = dimensions.currentWidth / 400;
  const scaleY = dimensions.currentHeight / 400;

  return (
    <div
      key={index}
      className="absolute bg-red-500 opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2"
      style={{
        width: `${diff.radius * 2 * scaleX}px`,
        height: `${diff.radius * 2 * scaleY}px`,
        top: `${diff.y * scaleY}px`,
        left: `${diff.x * scaleX}px`,
      }}
    ></div>
  );
})}
        </div>
      </div>
    </div>
  );
}
