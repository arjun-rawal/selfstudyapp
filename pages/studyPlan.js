import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Plan from "@/myComponents/plan";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

//kept class methods/attributes public
class Day {
  constructor(dayNumber, videoTopic, assignmentLink) {
    this.dayNumber = dayNumber;
    this.videoTopic = videoTopic;
    this.assignmentLink = assignmentLink;
    this.videoLink = "";
    this.assignmentCompleted = false;
    this.videoCompleted = false;
  }
}

class Week {
  constructor(weekNumber) {
    this.weekNumber = weekNumber;
    this.days = [];
  }

  addDay(day) {
    this.days.push(day);
  }
}

class Month {
  constructor(monthNumber) {
    this.monthNumber = monthNumber;
    this.weeks = [];
  }

  addWeek(week) {
    this.weeks.push(week);
  }
}

class Schedule {
  constructor() {
    this.months = [];
  }

  addMonth(month) {
    this.months.push(month);
  }
}

/**
 * Retrieves video links from findVideos api
 * @param {topics} list of subtopics to retrieve videos for
 * @returns array of video links
 */
async function fetchVideoLinks(topics) {
  try {
    const res = await fetch("/api/findVideos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topics }),
    });

    if (!res.ok) {
      console.error("Failed to fetch video links:", await res.text());
      return [];
    }

    const data = await res.json();
    return data.links;
  } catch (error) {
    console.error("Error fetching video links:", error);
    return [];
  }
}

/**
 * takes the json sent from openai and creates it into the object structure
 * @param {jsonArray} json formatted day-to-day structure
 */
async function parseSchedule(jsonArray) {
  const schedule = new Schedule();
  let currentMonth = null;
  let currentWeek = null;

  let dayCount = 0;
  let weekCount = 0;
  let monthCount = 0;
  const topics = [];

  jsonArray.forEach((dayData, index) => {
    dayCount++;
    const day = new Day(
      dayData.day,
      dayData.videoTopic,
      dayData.assignmentLink
    );
    topics.push(dayData.videoTopic);

    if (dayCount % 7 === 1 || currentWeek === null) {
      weekCount++;
      if (currentWeek) {
        currentMonth.addWeek(currentWeek);
      }
      currentWeek = new Week(weekCount);
    }

    currentWeek.addDay(day);

    if (dayCount % 30 === 1 || currentMonth === null) {
      monthCount++;
      if (currentMonth) {
        schedule.addMonth(currentMonth);
      }
      currentMonth = new Month(monthCount);
    }

    if (index === jsonArray.length - 1) {
      if (currentWeek) {
        currentMonth.addWeek(currentWeek);
      }
      if (currentMonth) {
        schedule.addMonth(currentMonth);
      }
    }
  });

  // Fetch video links for all topics
  const links = await fetchVideoLinks(topics);
  console.log(links);
  // Map the fetched links back to the days
  let linkIndex = 0;
  schedule.months.forEach((month) => {
    month.weeks.forEach((week) => {
      week.days.forEach((day) => {
        day.videoLink = links[linkIndex++] || "No video link available";
      });
    });
  });

  return schedule;
}

/**
 * retrieves the user's plan to be displayed
 * @param {token} sessionToken
 * @returns first plan associated with the user from the database
 */
async function getPlan(token) {
  if (!token) {
    console.error("No token provided");
    return null;
  }

  try {
    const res = await fetch("/api/checkPlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authToken: token }),
    });

    if (!res.ok) {
      console.error("Failed to fetch plan:", await res.text());
      return null;
    }

    const data = await res.json();
    if (!data.planExists){
      return null;
    }
    console.log("ABC",data);
    return data.result[0];
  } catch (error) {
    console.error("Error fetching plan:", error);
    return null;
  }
}

/**
 * Changes the schedule to the updated one
 * @param {planID} ID associated with the specific plan
 * @param {schedule} Updated schedule
 */
async function updateSchedule(planId, schedule) {
  if (!planId || !schedule) {
    console.error("planId and schedule required!");
    return;
  }
  console.log(planId, schedule);
  try {
    const res = await fetch("/api/fillSchedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: planId, schedule }),
    });

    if (!res.ok) {
      console.error("Failed to fetch plan:", await res.text());
      return null;
    }

    const data = await res.json();
    console.log(data);
    return data.result;
  } catch (error) {
    console.error("Error fetching plan:", error);
    return null;
  }
}

/**
 * displays the myComponents/plan.js component
 */
export default function StudyPlan() {
  const router = useRouter();
  const [daySchedule, setDaySchedule] = useState(null);
  const [planId, setPlanId] = useState("");
  const [authToken, setAuthToken] = useState(null);

  
  useEffect(() => {
    const token = Cookies.get("sessionToken");
    if (token) {
      setAuthToken(token);
    } else {
      // Redirect to home if no token is found
      router.replace("/").then(() => window.location.reload());
    }
  }, [router]);
  
  

  async function fetchData() {
    if (!authToken) {
      return;
    }
    try {
      const plan = await getPlan(authToken);
        console.log("PLAN IS HERE", plan);
        if (!plan){
          return;
        }
        const outputText = plan.outputText;
        const planID = plan._id;
        setPlanId(planID);
        if (!outputText) {
          console.error("No data received from the API");
          return;
        }

        if (!plan.schedule) {
          const parsedJson = JSON.parse(outputText);

          const schedule = await parseSchedule(parsedJson);
          setDaySchedule(schedule);
          updateSchedule(planID, schedule);
        } else {
          setDaySchedule(plan.schedule);
        }

      
    } catch (error) {
      console.error("Error processing the schedule:", error);
    }
  }
  useEffect(() => {

    fetchData();
    
  }, [authToken]);

  if (!daySchedule) return <div>Loading...</div>;

  return (
    <div>
      <Plan studyPlan={daySchedule} planID={planId} refreshPlan={fetchData} />
    </div>
  );
}
