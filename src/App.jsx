import { useState, useEffect } from "react";

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
  },
  {
    differences: [
      { x: 185, y: 65, radius: 15 },
      { x: 110, y: 127, radius: 18 }
    ],
  },
];

export default function SpotTheDifference() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [found, setFound] = useState(SHOW_CLUES ? levels[levelIndex].differences.map((_, i) => i) : []);
  const [timeLeft, setTimeLeft] = useState(120);
  const currentLevel = levels[levelIndex];

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);
  
  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.touches ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
    const y = event.touches ? event.touches[0].clientY - rect.top : event.clientY - rect.top;
    
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
        <img
            src='/logo.png'
            alt="progress indicator"
            className={`w-20 h-20 mr-5 `}
          />
        <h1 className="text-xl font-bold">PHOTOHUNT</h1></div>
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
        <div className="relative border p-2" onClick={handleClick}>
        

        <img src={`/levels/${levelIndex}/original.png`} alt="Original" className="w-[400px]" />
          {found.map((index) => (
            <div
              key={index}
              className="absolute bg-red-500 opacity-50 rounded-full"
              style={{
                width: currentLevel.differences[index].radius * 2 + "px",
                height: currentLevel.differences[index].radius * 2 + "px",
                top: currentLevel.differences[index].y - currentLevel.differences[index].radius + "px",
                left: currentLevel.differences[index].x - currentLevel.differences[index].radius + "px",
              }}
            ></div>
          ))}
        </div>
        <div className="relative border p-2" onClick={handleClick}>
        <img src={`/levels/${levelIndex}/modified.png`} alt="Modified" className="w-[400px]" />
          {found.map((index) => (
            <div
              key={index}
              className="absolute bg-red-500 opacity-50 rounded-full"
              style={{
                width: currentLevel.differences[index].radius * 2 + "px",
                height: currentLevel.differences[index].radius * 2 + "px",
                top: currentLevel.differences[index].y - currentLevel.differences[index].radius + "px",
                left: currentLevel.differences[index].x - currentLevel.differences[index].radius + "px",
              }}
            ></div>
          ))}
        </div>
      </div>
      
    </div>
  );
}