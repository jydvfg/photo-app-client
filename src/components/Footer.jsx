import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [countdown, setCountdown] = useState(getTimeUntilNextNoon());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeUntilNextNoon());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function getTimeUntilNextNoon() {
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(12, 0, 0, 0);
    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    const difference = targetTime - now;
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <footer>
      <nav>
        <ul>
          <li>
            <p>&copy; {new Date().getFullYear()} El Sexo</p>
          </li>
          <li>
            <p style={{ fontSize: "0.8pc" }}>{countdown}</p>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
