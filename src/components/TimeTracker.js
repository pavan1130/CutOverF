import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiBell } from "react-icons/fi";

const TimeTracker = () => {
  const [startTime, setStartTime] = useState(new Date());
  const [notificationPermission, setNotificationPermission] = useState(
    localStorage.getItem("notificationPermission") === "granted"
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notificationEnabled") === "true"
  );

  useEffect(() => {
    const timer = setInterval(() => {
      checkTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    if (notificationsEnabled) {
      showNotification("Notifications are enabled.");
    }
  }, [notificationsEnabled]);

  const checkTime = () => {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000; // in seconds

    if (elapsedTime >= 15 && elapsedTime < 16) {
      showNotification("Thanks for being in the application");
    }
    if (elapsedTime >= 20 && elapsedTime < 21) {
      showNotification("Take a short break");
    }
    if (elapsedTime >= 30 && elapsedTime < 31) {
      showNotification("Drink  water!");
    }
    if (elapsedTime >= 40 && elapsedTime < 41) {
      showNotification("Time for lunch!");
    }
  };

  const showNotification = (message) => {
    toast.info(message, {
      autoClose: 5000,
    });
  };

  const toggleNotifications = () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      localStorage.setItem("notificationEnabled", "false");
    } else {
      setNotificationsEnabled(true);
      localStorage.setItem("notificationEnabled", "true");
    }
  };

  return (
    <div>
      <div onClick={toggleNotifications}>
        <FiBell
          size={26}
          color={notificationsEnabled ? "white" : "yellow"}
          style={{ marginLeft: 15, cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default TimeTracker;
