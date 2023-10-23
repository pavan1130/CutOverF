//=======================================================================>>.all are done
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import "../Styles/welcome.css";
import Sidebar from "../components/sidebar";
// import { startTimer, resetTimer } from "../components/timer";

import { useUser } from "./UserContext";

function Welcome() {
  const { userData } = useUser();
  const [taskCounts, setTaskCounts] = useState({
    total: 0,
    inProgress: 0,
    incomplete: 0,
    issues: 0,
  });
  const userId = userData.user._id;
  const userName = userData.user.username;
  console.log(userId);
  console.log(userName);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/${userId}`
        );
        const data = await response.json();

        // Calculate counts for different statuses
        const total = data.user.tasks.length;
        const inProgress = data.user.tasks.filter(
          (task) => task.completionStatus === "progress"
        ).length;
        const incomplete = data.user.tasks.filter(
          (task) => !task.completionStatus
        ).length;
        const completed = data.user.tasks.filter(
          (task) => task.completionStatus === "completed"
        ).length;
        const issues = data.user.tasks.filter(
          (task) => task.completionStatus === "issue"
        ).length;

        setTaskCounts({ total, inProgress, incomplete, completed, issues });

        console.log("Total Tasks:", total);
        console.log("Total In Progress:", inProgress);
        console.log("Total Incomplete:", incomplete);
        console.log("Total Completed:", completed); // Added line
        console.log("Total Issues:", issues);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const donutChartData = [
    ["Task", "Hours per Day"],
    ["In Progress", 55],
    ["Total Task", 112],
    ["Completed", 42],
    // ['Issues', 5],
  ];

  // Donut Chart Options
  const donutChartOptions = {
    title: "",
    legend: "none",
    pieHole: 0.5,
    colors: [
      "red",
      "rgb(255, 162, 0)",
      "rgb(30, 144, 144)",
      "rgb(164, 39, 164)",
      "#9900ff",
      "#ff00cc",
    ],
    chartArea: {
      left: 10,
      top: 10,
      width: "100%",
      height: "80%",
    },
  };

  const lineChartData = [
    ["Year", "Direct", "Indirect"],
    ["Dec 20", 1000, 400],
    ["Jan 21", 1170, 460],
    ["Feb 21", 660, 1120],
    ["March 21", 1030, 540],
    ["April 21", 1030, 540],
  ];

  const lineChartOptions = {
    title: "",
    curveType: "function",
    legend: { position: "bottom" },
    series: {
      0: { color: "purple" },
      1: { color: "red" },
    },
  };

  // useEffect(() => {
  //   startTimer();

  //   return () => {
  //     resetTimer();
  //   };
  // }, []);
  // const queryParams = new URLSearchParams(window.location.search);
  // const userEmail = queryParams.get("userEmail") || "";
  // console.log(userDetails);

  return (
    <div className="welcome">
      <Sidebar />

      <div className="container">
        <div className="row">
          <div className="col">
            <h2>{`Hello ${userName}`}</h2>
            <div>
              <p>
                Welcome to the <strong>Cutover Automation Dashboard!</strong>{" "}
                Wth our powerful automation tools, you can seamlessely
                orchestrate cutover activities, reduce downtime, and enhance
                project success.
              </p>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div className="card card-one">
                  <div className="text">
                    Last 2 Days
                    <h1>{taskCounts.total}</h1>
                    <p>+10%</p>
                  </div>
                  <div className="rotated-card">
                    <div className="rotate-text">Total Tasks</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card card-two">
                  <div className="text">
                    Last 2 Days
                    <h1>{taskCounts.inProgress}</h1>
                    <p>+15%</p>
                  </div>
                  <div className="rotated-card">
                    <div className="rotate-text">In Progress</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card card-three">
                  <div className="text">
                    Last 2 Days
                    <h1>{taskCounts.completed}</h1>
                    <p>+15%</p>
                  </div>
                  <div className="rotated-card">
                    <div className="rotate-text">Completed</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card card-four">
                  <div className="text">
                    Last 2 Days
                    <h1>{taskCounts.issues}</h1>
                    <p>+15%</p>
                  </div>
                  <div className="rotated-card">
                    <div className="rotate-text">Issues</div>
                  </div>
                </div>
              </div>
            </div>

            <hr></hr>

            <div container>
              <div className="container text-center">
                <div className="row">
                  <div className="col-md-auto">
                    <div className="tasks-box">
                      <h6>Tasks</h6>
                      <Chart
                        chartType="PieChart"
                        width="100%"
                        height="80%"
                        data={donutChartData}
                        options={donutChartOptions}
                      />
                      <div className="chart-labels">
                        <div>Total Task</div>
                        <div>In Progress</div>
                        <div>Completed</div>
                        {/* <div>Issues</div> */}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="row row-one align-items-center">
                      <div className="parent-row-one">
                        <div className="directvsindirect mx-2">
                          Direct vs Indirect
                        </div>
                        <div className="dot purple mx-2"></div>
                        <div className="direct mx-2">Direct</div>
                        <div className="dot red mx-2"></div>
                        <div className="indirect">Indirect</div>
                      </div>
                    </div>

                    <div className="row row-two mt-3">
                      <div className="parent-row-two">
                        <Chart
                          chartType="LineChart"
                          width="100%%"
                          height="100%"
                          data={lineChartData}
                          options={lineChartOptions}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
//====================================================================>>below is working fine
// import React from "react";
// import { Chart } from "react-google-charts";
// import "../Styles/welcome.css";
// import Sidebar from "../components/sidebar";

// import { useUser } from "./UserContext";

// function Welcome() {
//   const { userData } = useUser();
//   const userId = userData.user._id;
//   console.log(userId);

//   const totalTask = userData.user.tasks.length;
//   console.log(userData.user.tasks);
//   console.log(`total task ${totalTask}`);

//   //filter details from userData
//   const totalInprogress = userData.user.tasks.filter(
//     (task) => task.completionStatus === "progress"
//   ).length;
//   const totalIncomplete = userData.user.tasks.filter(
//     (task) => !task.completionStatus
//   ).length;
//   const totalIssues = userData.user.tasks.filter(
//     (task) => task.completionStatus === "issue"
//   ).length;

//   console.log("Total In Progress:", totalInprogress);
//   console.log("Total Incomplete:", totalIncomplete);
//   console.log("Total Issues:", totalIssues);

//   const donutChartData = [
//     ["Task", "Hours per Day"],
//     ["In Progress", 55],
//     ["Total Task", 112],
//     ["Completed", 42],
//     // ['Issues', 5],
//   ];

//   // Donut Chart Options
//   const donutChartOptions = {
//     title: "",
//     legend: "none",
//     pieHole: 0.5,
//     colors: [
//       "red",
//       "rgb(255, 162, 0)",
//       "rgb(30, 144, 144)",
//       "rgb(164, 39, 164)",
//       "#9900ff",
//       "#ff00cc",
//     ],
//     chartArea: {
//       left: 10,
//       top: 10,
//       width: "100%",
//       height: "80%",
//     },
//   };

//   const lineChartData = [
//     ["Year", "Direct", "Indirect"],
//     ["Dec 20", 1000, 400],
//     ["Jan 21", 1170, 460],
//     ["Feb 21", 660, 1120],
//     ["March 21", 1030, 540],
//     ["April 21", 1030, 540],
//   ];

//   const lineChartOptions = {
//     title: "",
//     curveType: "function",
//     legend: { position: "bottom" },
//     series: {
//       0: { color: "purple" },
//       1: { color: "red" },
//     },
//   };

//   // const queryParams = new URLSearchParams(window.location.search);
//   // const userEmail = queryParams.get("userEmail") || "";
//   // console.log(userDetails);

//   return (
//     <div className="welcome">
//       <Sidebar />
//       <div className="container">
//         <div className="row">
//           <div className="col">
//             <h2>Hello</h2>
//             <div>
//               <p>
//                 Welcome to the <strong>Cutover Automation Dashboard!</strong>{" "}
//                 Wth our powerful automation tools, you can seamlessely
//                 orchestrate cutover activities, reduce downtime, and enhance
//                 project success.
//               </p>
//             </div>
//             <div className="row">
//               <div className="col-md-3">
//                 <div className="card card-one">
//                   <div className="text">
//                     Last 2 Days
//                     <h1>{totalTask}</h1>
//                     <p>+10%</p>
//                   </div>
//                   <div className="rotated-card">
//                     <div className="rotate-text">Total Tasks</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card card-two">
//                   <div className="text">
//                     Last 2 Days
//                     <h1>{totalInprogress}</h1>
//                     <p>+15%</p>
//                   </div>
//                   <div className="rotated-card">
//                     <div className="rotate-text">In Progress</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card card-three">
//                   <div className="text">
//                     Last 2 Days
//                     <h1>{totalIncomplete}</h1>
//                     <p>+15%</p>
//                   </div>
//                   <div className="rotated-card">
//                     <div className="rotate-text">Completed</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card card-four">
//                   <div className="text">
//                     Last 2 Days
//                     <h1>{totalIssues}</h1>
//                     <p>+15%</p>
//                   </div>
//                   <div className="rotated-card">
//                     <div className="rotate-text">Issues</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <hr></hr>

//             <div container>
//               <div className="container text-center">
//                 <div className="row">
//                   <div className="col-md-auto">
//                     <div className="tasks-box">
//                       <h6>Tasks</h6>
//                       <Chart
//                         chartType="PieChart"
//                         width="100%"
//                         height="80%"
//                         data={donutChartData}
//                         options={donutChartOptions}
//                       />
//                       <div className="chart-labels">
//                         <div>Total Task</div>
//                         <div>In Progress</div>
//                         <div>Completed</div>
//                         {/* <div>Issues</div> */}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col">
//                     <div className="row row-one align-items-center">
//                       <div className="parent-row-one">
//                         <div className="directvsindirect mx-2">
//                           Direct vs Indirect
//                         </div>
//                         <div className="dot purple mx-2"></div>
//                         <div className="direct mx-2">Direct</div>
//                         <div className="dot red mx-2"></div>
//                         <div className="indirect">Indirect</div>
//                       </div>
//                     </div>

//                     <div className="row row-two mt-3">
//                       <div className="parent-row-two">
//                         <Chart
//                           chartType="LineChart"
//                           width="100%%"
//                           height="100%"
//                           data={lineChartData}
//                           options={lineChartOptions}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-auto right-activity">
//             Variable width content
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Welcome;
//===========================================================>>>below is original code
// Welcome.js
// import React from "react";
// import { Chart } from "react-google-charts";
// import "../Styles/welcome.css";
// import Sidebar from "../components/sidebar";

// import { useUser } from "./UserContext";

// function Welcome({ userDetails }) {
//   const { userData } = useUser();

//   const donutChartData = [
//     ["Task", "Hours per Day"],
//     ["In Progress", 55],
//     ["Total Task", 112],
//     ["Completed", 42],
//     // ['Issues', 5],
//   ];

//   // Donut Chart Options
//   const donutChartOptions = {
//     title: "",
//     legend: "none",
//     pieHole: 0.5,
//     colors: [
//       "red",
//       "rgb(255, 162, 0)",
//       "rgb(30, 144, 144)",
//       "rgb(164, 39, 164)",
//       "#9900ff",
//       "#ff00cc",
//     ],
//     chartArea: {
//       left: 10,
//       top: 10,
//       width: "100%",
//       height: "80%",
//     },
//   };

//   const lineChartData = [
//     ["Year", "Direct", "Indirect"],
//     ["Dec 20", 1000, 400],
//     ["Jan 21", 1170, 460],
//     ["Feb 21", 660, 1120],
//     ["March 21", 1030, 540],
//     ["April 21", 1030, 540],
//   ];

//   const lineChartOptions = {
//     title: "",
//     curveType: "function",
//     legend: { position: "bottom" },
//     series: {
//       0: { color: "purple" },
//       1: { color: "red" },
//     },
//   };

//   // const queryParams = new URLSearchParams(window.location.search);
//   // const userEmail = queryParams.get("userEmail") || "";
//   console.log(userDetails);

//   return (
//     <div className="welcome">
//       <Sidebar />
//       <div className="container">
//         <div className="row">
//           <div className="col">
//             <h2>Hello</h2>
//             <div>
//               <p>
//                 Welcome to the <strong>Cutover Automation Dashboard!</strong>{" "}
//                 Wth our powerful automation tools, you can seamlessely
//                 orchestrate cutover activities, reduce downtime, and enhance
//                 project success.
//               </p>
//             </div>
//             <div className="row">
//               <div className="col-md-3">
//                 <div className="card card-one">
//                   <div className="text">
//                     Last 2 Days
//                     <h1>112</h1>
//                     <p>+10%</p>
//                   </div>
//                   <div className="rotated-card">
//                     <div className="rotate-text">Total Tasks</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card card-two">
//                   <div className="text">
//                     Last 2 Days
//                     <h1>55</h1>
//                     <p>+15%</p>
//                   </div>
//                   <div className="rotated-card">
//                     <div className="rotate-text">In Progress</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card card-three">
//                   <div className="text">
//                     Last 2 Days
//                     <h1>42</h1>
//                     <p>+15%</p>
//                   </div>
//                   <div className="rotated-card">
//                     <div className="rotate-text">Completed</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card card-four">
//                   <div className="text">
//                     Last 2 Days
//                     <h1>05</h1>
//                     <p>+15%</p>
//                   </div>
//                   <div className="rotated-card">
//                     <div className="rotate-text">Issues</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <hr></hr>

//             <div container>
//               <div className="container text-center">
//                 <div className="row">
//                   <div className="col-md-auto">
//                     <div className="tasks-box">
//                       <h6>Tasks</h6>
//                       <Chart
//                         chartType="PieChart"
//                         width="100%"
//                         height="80%"
//                         data={donutChartData}
//                         options={donutChartOptions}
//                       />
//                       <div className="chart-labels">
//                         <div>Total Task</div>
//                         <div>In Progress</div>
//                         <div>Completed</div>
//                         {/* <div>Issues</div> */}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col">
//                     <div className="row row-one align-items-center">
//                       <div className="parent-row-one">
//                         <div className="directvsindirect mx-2">
//                           Direct vs Indirect
//                         </div>
//                         <div className="dot purple mx-2"></div>
//                         <div className="direct mx-2">Direct</div>
//                         <div className="dot red mx-2"></div>
//                         <div className="indirect">Indirect</div>
//                       </div>
//                     </div>

//                     <div className="row row-two mt-3">
//                       <div className="parent-row-two">
//                         <Chart
//                           chartType="LineChart"
//                           width="100%%"
//                           height="100%"
//                           data={lineChartData}
//                           options={lineChartOptions}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-auto right-activity">
//             Variable width content
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Welcome;
