import React, { useState } from "react";
import "../Styles/addtaskform.css";

const AddTaskForm = ({ userId, onTaskAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    taskId: "",
    taskName: "",
    assignedTo: "",
    priority: "low",
    dueDate: "",
    completionStatus: "progress",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://amused-khakis-fly.cyclic.app/api/users/${userId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
  };

  return (
    <div className="add-task-form">
      <h3>Add Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="taskId">Task ID</label>
          <input
            type="text"
            id="taskId"
            name="taskId"
            value={formData.taskId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            id="taskName"
            name="taskName"
            value={formData.taskName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="assignedTo">Assigned To</label>
          <input
            type="text"
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="completionStatus">Completion Status</label>
          <select
            id="completionStatus"
            name="completionStatus"
            value={formData.completionStatus}
            onChange={handleChange}
            required
          >
            <option value="progress">Progress</option>
            <option value="completed">Completed</option>
            <option value="issue">Issue</option>
          </select>
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;

//==============================================>>>

// import React, { useState } from "react";
// import { useUser } from "./UserContext";

// const AddTaskForm = ({ userId, onTaskAdded }) => {
//   const [formData, setFormData] = useState({
//     taskId: "",
//     taskName: "",
//     assignedTo: "",
//     priority: "low",
//     dueDate: "",
//     completionStatus: "progress",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (formData) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/users/${userId}/tasks`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (response.ok) {
//         const newTask = await response.json();
//         onFormSubmit(newTask);
//       } else {
//         console.error("Error adding task:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error adding task:", error);
//     }
//   };

//   return (
//     <div className="add-task-form">
//       <h3>Add Task</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="taskId">Task ID</label>
//           <input
//             type="text"
//             id="taskId"
//             name="taskId"
//             value={formData.taskId}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="taskName">Task Name</label>
//           <input
//             type="text"
//             id="taskName"
//             name="taskName"
//             value={formData.taskName}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="assignedTo">Assigned To</label>
//           <input
//             type="text"
//             id="assignedTo"
//             name="assignedTo"
//             value={formData.assignedTo}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="priority">Priority</label>
//           <select
//             id="priority"
//             name="priority"
//             value={formData.priority}
//             onChange={handleChange}
//             required
//           >
//             <option value="low">Low</option>
//             <option value="normal">Normal</option>
//             <option value="high">High</option>
//           </select>
//         </div>
//         <div className="form-group">
//           <label htmlFor="dueDate">Due Date</label>
//           <input
//             type="date"
//             id="dueDate"
//             name="dueDate"
//             value={formData.dueDate}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="completionStatus">Completion Status</label>
//           <select
//             id="completionStatus"
//             name="completionStatus"
//             value={formData.completionStatus}
//             onChange={handleChange}
//             required
//           >
//             <option value="progress">Progress</option>
//             <option value="completed">Completed</option>
//             <option value="issue">Issue</option>
//           </select>
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default AddTaskForm;
