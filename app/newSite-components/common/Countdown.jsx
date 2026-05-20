"use client";
import React, { useState, useEffect } from "react";

const CountdownTimer = ({ style = 1, targetDate = "2025-06-31T23:59:59" }) => {
  const [showTimer, setShowTimer] = useState(false);
  useEffect(() => {
    setShowTimer(true);
  }, []);

  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null; // Time is up
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, [targetDate]);

  if (!timeLeft) {
    return <div>Time's up!</div>;
  }

  return (
    <>
      {showTimer ? (
        <>
          {style == 1 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
                <span className="countdown__label">D :</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
                <span className="countdown__label">H :</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">M :</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label">S</span>
              </span>
            </div>
          )}
          {style == 2 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
                <span className="countdown__label">Days</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
                <span className="countdown__label">Hours</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">Mins</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label">Secs</span>
              </span>
            </div>
          )}
          {style == 3 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
                <span className="countdown__label">DAYS</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
                <span className="countdown__label">HOURS</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">MINUTES</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label">SECONDS</span>
              </span>
            </div>
          )}
          {style == 4 && (
            <div aria-hidden="true" class="countdown__timer">
              <span class="countdown__item">
                <span class="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span class="countdown__label">:</span>
              </span>
              <span class="countdown__item">
                <span class="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span class="countdown__label"></span>
              </span>
            </div>
          )}

          {style == 5 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
                <span className="countdown__label">d :</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
                <span className="countdown__label">h :</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">m :</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label">s</span>
              </span>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default CountdownTimer;
