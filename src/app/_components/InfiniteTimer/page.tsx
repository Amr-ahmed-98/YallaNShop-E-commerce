import React, { useState, useEffect } from 'react';

const InfiniteTimer = () => {
  const [timeLeft, setTimeLeft] = useState(3 * 24 * 60 * 60); // 3 days in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          return 3 * 24 * 60 * 60; // Reset to 3 days when it reaches 0
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time:number) => {
    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = time % 60;

    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center p-4">
      <div className="text-4xl font-bold">{value.toString().padStart(2, '0')}</div>
      <div className="text-sm uppercase">{label}</div>
    </div>
  );

  return (
    <div className="flex justify-center items-center space-x-4">
      <TimeUnit value={days} label="Days" />
      <TimeUnit value={hours} label="Hours" />
      <TimeUnit value={minutes} label="Minutes" />
      <TimeUnit value={seconds} label="Seconds" />
    </div>
  );
};

export default InfiniteTimer;