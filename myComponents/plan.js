import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogBackdrop,
} from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import YouTubeEmbed from "./YoutubeEmbed";
import { useRouter } from "next/router";


/** 
 * Render the studyPlan object on screen
 * @param {studyPlan} plan object created in pages/studyPlan.js
 * @param {planID} id of the user's plan from the database
 * @param {refreshPlan} function from pages/studyPlan.js to update the plan object on plan modification (user clicking done on a task)
 * @returns jsx react component for the plan to display on front-end
*/
const Plan = ({ studyPlan, planID, refreshPlan }) => {
  const router = useRouter();

  async function handleLogout() {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/");
      window.location.reload();
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
}
  const { months } = studyPlan;
  const [selectedDay, setSelectedDay] = useState(null);
  const [assignmentCompleted, setAssignmentCompleted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);

  const handleDayClick = (day) => {
    console.log("DAYC",assignmentCompleted,videoCompleted)
    setAssignmentCompleted(day.assignmentCompleted);
    setVideoCompleted(day.videoCompleted);
    setSelectedDay(day);
  };


/** 
 * When the user clicks off a card, it sets a new studyplan with the modified completed attributes, then sends that plan to the database
 */  
    async function handleExit() {
    let updatedStudyPlan = JSON.parse(JSON.stringify(studyPlan)); //makes a new copy instead of modifying both
    console.log("COMPLETED?:",assignmentCompleted, videoCompleted);
    for (let month of updatedStudyPlan.months) {
      for (let week of month.weeks) {
        for (let day of week.days) {
          if (day.dayNumber === selectedDay.dayNumber) {
            day.assignmentCompleted = assignmentCompleted;
            day.videoCompleted = videoCompleted;
          }
        }
      }
    }

    try {
      const res = await fetch("/api/fillSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: planID, schedule: updatedStudyPlan }),
      });

      if (!res.ok) {
        console.error("Failed to fetch plan:", await res.text());
        return null;
      }

      const data = await res.json();
      console.log(data);
      refreshPlan();
      return data.result;
    } catch (error) {
      console.error("Error updating plan:", error);
      return null;
    }
  }
  return (
    <VStack spacing={6} align="stretch" w="100vw" paddingLeft="1vw" paddingRight="1vw">
            <Button
                  position={"absolute"}
                  left={"90vw"}
                  top={"2vh"}
                  transform={"translate(0%,0%)"}
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Log out
                </Button>
      {months.map((month, monthIndex) => (
        <Box key={monthIndex}>
          <Heading mb={5} textAlign="center">
            Month {month.monthNumber}
          </Heading>
          {month.weeks.map((week, weekIndex) => (
            <Box key={weekIndex} mb={6}>
              <Heading size={"lg"} mb={2} textAlign="center">
                Week {week.weekNumber}
              </Heading>
              <HStack gap={"1vw"} wrap="wrap">
                {week.days.map((day, dayIndex) => (
                  <DialogRoot key={dayIndex} onExitComplete={handleExit}>
                    <DialogTrigger asChild>
                      <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        shadow="md"
                        w="13.14vw" //2vw padding + 1vw gap*6 =8 92/7=13.14
                        minHeight="150px"
                        cursor="pointer"
                        bg={
                          day.assignmentCompleted && day.videoCompleted
                            ? "green.100"
                            : " "
                        }
                        borderColor={
                          day.assignmentCompleted && day.videoCompleted
                            ? "green.500"
                            : ""
                        }
                        onClick={() => handleDayClick(day)}
                      >
                        <Heading as="h4" size="sm">
                          Day {day.dayNumber}
                        </Heading>
                        <Text mt={2} noOfLines={1}>
                          {day.videoTopic}
                        </Text>
                      </Box>
                    </DialogTrigger>
                    <DialogBackdrop
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                      }}
                    />
                    <DialogContent
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1010,
                        maxWidth: "500px",
                        width: "90%",
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
                        textAlign: "center",
                        alignItems: "center",
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>
                          {" "}
                          Day {selectedDay?.dayNumber}{" "}
                        </DialogTitle>
                        <Text fontWeight={"bold"} mb={2}>
                          {selectedDay?.videoTopic}
                        </Text>
                      </DialogHeader>
                      <DialogBody>
                        <Text fontWeight="bold">Assignment:</Text>
                        <Text mb={4}>
                          <a
                            href={selectedDay?.assignmentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                            }}
                            wordwrap= "break-word" 
                            wordbreak= "break-all" 
                          >
                            {selectedDay?.assignmentLink}
                          </a>
                        </Text>
                        <Text fontWeight="bold">Video:</Text>
                        <YouTubeEmbed url={selectedDay?.videoLink} />

                        <Text>
                          {selectedDay?.videoLink !==
                          "No video link available" ? (
                            <a
                              href={selectedDay?.videoLink}
                              style={{
                                color: "blue",
                                textDecoration: "underline",
                              }}
                            >
                              {selectedDay?.videoLink}
                            </a>
                          ) : (
                            "No video link available"
                          )}
                        </Text>
                      </DialogBody>
                      <DialogFooter>
                        <VStack>
                          <Checkbox
                            checked={assignmentCompleted}
                            onCheckedChange={(e) => {
                              setAssignmentCompleted(e.checked);
                            }}
                          >
                            Assignment Completed
                          </Checkbox>
                          <Checkbox
                            checked={videoCompleted}
                            onCheckedChange={(e) => {
                              setVideoCompleted(e.checked);
                            }}
                          >
                            Video Completed
                          </Checkbox>
                          <DialogCloseTrigger asChild>
                            <Button variant="solid" colorScheme="blue">
                              Close
                            </Button>
                          </DialogCloseTrigger>
                        </VStack>
                      </DialogFooter>
                    </DialogContent>
                  </DialogRoot>
                ))}
              </HStack>
            </Box>
          ))}
        </Box>
      ))}
    </VStack>
  );
};

export default Plan;
