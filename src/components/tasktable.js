import React, { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import Sidebar from "./sidebar";
import AddTaskForm from "./AddTaskForm";
import "../Styles/tasktablenew.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import myLocalImage from "../images/vioce.png";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { BiSolidCheckbox } from "react-icons/bi";
import { BsFilterLeft } from "react-icons/bs";
function TaskTable() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { userData } = useUser();
  const userId = userData.user._id;
  // Checkboxes
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://amused-khakis-fly.cyclic.app/api/users/${userId}`
      );
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
    // Custom filter function to match the search input against task data
    const searchLowerCase = search.toLowerCase();
    const filtered = tasks.filter((task) => {
      const parts = Object.values(task).map((value) =>
        String(value).toLowerCase()
      );

      const priority = task.priority?.toLowerCase() || "";
      const completionStatus = task.completionStatus?.toLowerCase() || "";

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

      const matchesSearch = parts.some((part) =>
        part.includes(searchLowerCase)
      );

      return matchesSearch;
    });

    setFilteredTasks(filtered);
  }, [search, tasks]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredTasks.length / tasksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
              `https://amused-khakis-fly.cyclic.app/api/users/${userId}/tasks`,
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
          `https://amused-khakis-fly.cyclic.app/api/users/${userId}/tasks/${taskId}`,
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
  // const handleSendEmail = async (userId, taskId, recipientEmail) => {
  //   try {
  //     const response = await fetch("/api/send-email", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ userId, taskId, recipientEmail }),
  //     });

  //     if (response.ok) {
  //       alert("Email sent successfully!");
  //     } else {
  //       alert("Error sending email.");
  //     }
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     alert("Error sending email.");
  //   }
  // };

  function getPriorityClass(priority) {
    switch (priority) {
      case "low":
        return "low-priority";
      case "normal":
        return "normal-priority";
      case "high":
        return "high-priority";
      default:
        return ""; // Add a default class if needed
    }
  }
  function getStatusClass(status) {
    // Check if status is defined and not null
    if (status) {
      const lowerCaseStatus = status.toLowerCase();

      switch (lowerCaseStatus) {
        case "completed":
          return "completed-status";
        case "issue":
          return "issue-status";
        case "progress":
          return "progress-status";
        default:
          return ""; // Add a default class if needed
      }
    } else {
      return ""; // Handle the case where status is undefined or null
    }
  }

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
      {/* <button
        className="button"
        onClick={handleSendEmail}
        disabled={!selectedTasks.length}
      >
        Send Mail
      </button> */}
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
        <div className="filter-container">
          <BsFilterLeft size={24} className="filter-icon" />
          <span className="filter-text">Filter</span>
          <input
            type="text"
            placeholder="Search"
            className="input-field1"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table id="taskTable">
          <thead>
            <tr>
              <th>
                <FaCheckSquare />
              </th>
              <th>Task ID</th>
              <th>Task Name</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Completion Status</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task) => (
              <tr key={task._id}>
                <td>
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={selectedTasks.includes(task._id)}
                    onChange={() => handleCheckboxChange(task._id)}
                  />
                </td>
                <td>{task.taskId}</td>
                <td>{task.taskName}</td>
                <td>{task.assignedTo}</td>
                <td className={getPriorityClass(task.priority)}>
                  {task.priority}
                </td>
                <td>{task.dueDate}</td>
                <td className={getStatusClass(task.completionStatus)}>
                  {task.completionStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="l">
          <h6 className="priority">Priority Keys : </h6>
          <BiSolidCheckbox style={{ color: "red", height: 20, width: 20 }} />
          <p className="pp">low</p>
          <BiSolidCheckbox style={{ color: "green", height: 20, width: 20 }} />
          <p className="pp">high</p>
          <BiSolidCheckbox
            style={{ color: "yellowgreen", height: 20, width: 20 }}
          />
          <p className="pp">normal</p>
          <div className="vertical-line"></div>
          <h6 className="priority">Completion Status Keys : </h6>
          <BiSolidCheckbox style={{ color: "Sea", height: 20, width: 20 }} />
          <p className="pp">completed</p>
          <BiSolidCheckbox style={{ color: "red", height: 20, width: 20 }} />
          <p className="pp">issue</p>
          <BiSolidCheckbox style={{ color: "purple", height: 20, width: 20 }} />
          <p className="pp">progress</p>
        </div>
      </div>
      <div className="pagination">
        <button
          className="pagination-button1"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <FaArrowLeft />
          Previous
        </button>
        {Array(Math.ceil(filteredTasks.length / tasksPerPage))
          .fill()
          .map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`pagination-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        <button
          className="pagination-button2"
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredTasks.length / tasksPerPage)
          }
        >
          Next <FaArrowRight />
        </button>
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
