import React, { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import Sidebar from "./sidebar";
import AddTaskForm from "./AddTaskForm";
import "../Styles/tasktablenew.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import myLocalImage from "../images/vioce.png";

function TaskTable() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { userData } = useUser();
  const userId = userData.user._id;
  // Checkboxes
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [isBlinking, setIsBlinking] = useState(false);
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`);
      const data = await response.json();
      const userTasks = data.user.tasks || []; // Ensure userTasks is an array
      setTasks(userTasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowForm(false);
  };

  // Voice input
  const handleVoiceInput = () => {
    setIsBlinking(!isBlinking);
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setSearch(speechToText);
        // searchInBrowser(speechToText);
      };
      recognition.start();
    } else {
      console.error("Speech recognition is not supported in this browser.");
      // Handle the lack of support, e.g., by displaying a message to the user.
    }
  };
  // const searchInBrowser = (query) => {
  //   // Replace 'searchEngineURL' with the URL of your preferred search engine (e.g., Google).
  //   const searchEngineURL = `https://www.google.com/search?q=${encodeURIComponent(
  //     query
  //   )}`;

  //   // Open the search in a new tab or window.
  //   window.open(searchEngineURL, "_blank");
  // };
  const handleCancelForm = () => {
    setShowForm(false);
  };
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const searchLowerCase = search.toLowerCase();

    // Custom filter function to match the search input against task data
    const filtered = tasks.filter((task) => {
      // Split the task data into individual parts
      const parts = Object.values(task).map((value) =>
        String(value).toLowerCase()
      );

      const priority = task.priority?.toLowerCase() || ""; // Use an empty string if priority is undefined
      const completionStatus = task.completionStatus?.toLowerCase() || ""; // Use an empty string if completionStatus is undefined

      if (
        (searchLowerCase.includes("low") && priority.includes("low")) ||
        (searchLowerCase.includes("high") && priority.includes("high")) ||
        (searchLowerCase.includes("normal") && priority.includes("normal")) ||
        (searchLowerCase.includes("completed") &&
          completionStatus.includes("completed")) ||
        (searchLowerCase.includes("issue") &&
          completionStatus.includes("issue")) ||
        (searchLowerCase.includes("progress") &&
          completionStatus.includes("progress"))
      ) {
        return true;
      }

      // Check if the search input matches any part of the task data
      const matchesSearch = parts.some((part) =>
        part.includes(searchLowerCase)
      );

      return matchesSearch;
    });

    setFilteredTasks(filtered);
  }, [search, tasks]);

  // Handle download
  const handleDownload = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

    const filteredForDownload = tasks.map(
      ({
        taskId,
        taskName,
        assignedTo,
        priority,
        dueDate,
        completionStatus,
      }) => ({
        taskId,
        taskName,
        assignedTo,
        priority,
        dueDate,
        completionStatus,
      })
    );

    const ws = XLSX.utils.json_to_sheet(filteredForDownload);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const excelData = XLSX.utils.sheet_to_json(sheet);

        for (const taskData of excelData) {
          try {
            const response = await fetch(
              `http://localhost:3000/api/users/${userId}/tasks`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
              }
            );

            if (response.ok) {
              const newTask = await response.json();
              onTaskAdded(newTask);
            } else {
              console.error("Error adding task:", response.statusText);
            }
          } catch (error) {
            console.error("Error adding task:", error);
          }
        }
      } catch (error) {
        console.error("Error processing Excel data:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle download PDF
  const handleDownloadPDF = () => {
    const projectName = prompt("Enter project name:");
    if (projectName !== null) {
      const doc = new jsPDF();

      doc.text(`Project Name: ${projectName}`, 10, 10);

      // Get the table element
      const element = document.getElementById("taskTable");

      // Generate PDF from the table
      doc.autoTable({ html: element });

      const userEmail = userData.user.email;
      const timestamp = new Date().toLocaleString();

      // Calculate the vertical position for the email and timestamp
      const yPos = doc.internal.pageSize.height - 10;

      // Add user email and download date at the bottom
      doc.text(`User Email: ${userEmail}`, 10, yPos - 10);
      doc.text(`Downloaded at: ${timestamp}`, 10, yPos);

      // Save the PDF
      doc.save(`tasks_${projectName}.pdf`);
    }
  };

  // Checkbox functions
  const handleCheckboxChange = (taskId) => {
    const updatedSelectedTasks = [...selectedTasks];
    if (updatedSelectedTasks.includes(taskId)) {
      updatedSelectedTasks.splice(updatedSelectedTasks.indexOf(taskId), 1);
    } else {
      updatedSelectedTasks.push(taskId);
    }
    setSelectedTasks(updatedSelectedTasks);
  };

  const handleDeleteSelectedTasks = async () => {
    try {
      for (const taskId of selectedTasks) {
        const response = await fetch(
          `http://localhost:3000/api/users/${userId}/tasks/${taskId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Remove the deleted task from the state
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
        } else {
          console.error(`Error deleting task ${taskId}:`, response.statusText);
        }
      }
      setSelectedTasks([]); // Clear selected tasks after deletion
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  // Send email
  const handleSendEmail = async (userId, taskId, recipientEmail) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, taskId, recipientEmail }),
      });

      if (response.ok) {
        alert("Email sent successfully!");
      } else {
        alert("Error sending email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email.");
    }
  };

  return (
    <>
      <Sidebar />
      <button className="button" onClick={() => setShowForm(true)}>
        Add Task
      </button>
      <button className="button" onClick={handleDownload}>
        Download Excel
      </button>
      <label htmlFor="fileInput" className="file-input-label">
        Upload Excel
      </label>
      <input
        id="fileInput"
        className="file-input"
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
      />

      <button className="button" onClick={handleDownloadPDF}>
        Download PDF
      </button>
      <button
        className="button"
        onClick={handleDeleteSelectedTasks}
        disabled={!selectedTasks.length}
      >
        Delete Selected Tasks
      </button>
      <button
        className="button"
        onClick={handleSendEmail}
        disabled={!selectedTasks.length}
      >
        Send Mail
      </button>
      <button className="button" onClick={fetchData}>
        Reload Tasks
      </button>
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="popup-close" onClick={() => setShowForm(false)}>
              &times;
            </span>
            <AddTaskForm
              userId={userId}
              onTaskAdded={handleTaskAdded}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}
      <div>
        <table id="taskTable">
          <thead>
            <tr>
              <th>Select task</th>
              <th>Task ID</th>
              <th>Task Name</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Completion Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task._id)}
                    onChange={() => handleCheckboxChange(task._id)}
                  />
                </td>
                <td>{task.taskId}</td>
                <td>{task.taskName}</td>
                <td>{task.assignedTo}</td>
                <td>{task.priority}</td>
                <td>{task.dueDate}</td>
                <td>{task.completionStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="last">
        <div className="user-input">
          <img
            src={myLocalImage}
            alt="AI Bot Image"
            width="100"
            className={`bot-image ${isBlinking ? "blinking" : ""}`}
            onClick={handleVoiceInput}
          />
          <input
            type="text"
            placeholder="Type your message..."
            className="input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

export default TaskTable;
