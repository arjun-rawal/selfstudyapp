import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
  Link,
} from "@chakra-ui/react";
import YouTubeEmbed from "./YoutubeEmbed";
import { useRouter } from "next/router";

const Plan = ({ studyPlan, planID, refreshPlan }) => {
  const router = useRouter();
  const { months } = studyPlan;
  const [selectedDay, setSelectedDay] = useState(null);
  const [assignmentCompleted, setAssignmentCompleted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (day) => {
    setAssignmentCompleted(day.assignmentCompleted);
    setVideoCompleted(day.videoCompleted);
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    handleExit();
  };

  const handleExit = async () => {
    let updatedStudyPlan = JSON.parse(JSON.stringify(studyPlan));
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
  };

  const handleLogout = async () => {
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
  };

  const dayCardWidth = useBreakpointValue({ base: "100%", md: "13.14vw" });

  return (
    <VStack spacing={6} align="stretch" w="100%" paddingLeft="1vw" paddingRight="1vw">
      <Button
        position={"absolute"}
        left={{ base: "80vw", md: "90vw" }}
        top={"2vh"}
        transform={"translate(0%,0%)"}
        onClick={handleLogout}
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
                  <Box
                    key={dayIndex}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    shadow="md"
                    w={dayCardWidth}
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
                ))}
              </HStack>
            </Box>
          ))}
        </Box>
      ))}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Day {selectedDay?.dayNumber}</Heading>
            <Text fontWeight={"bold"} mb={2}>
              {selectedDay?.videoTopic}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold">Assignment:</Text>
            <Text mb={4}>
              <Link
                href={selectedDay?.assignmentLink}
                isExternal
                color="blue.500"
                textDecoration="underline"
              >
                {selectedDay?.assignmentLink}
              </Link>
            </Text>
            <Text fontWeight="bold">Video:</Text>
            <YouTubeEmbed url={selectedDay?.videoLink} />
            <Text>
              {selectedDay?.videoLink !== "No video link available" ? (
                <Link
                  href={selectedDay?.videoLink}
                  isExternal
                  color="blue.500"
                  textDecoration="underline"
                >
                  {selectedDay?.videoLink}
                </Link>
              ) : (
                "No video link available"
              )}
            </Text>
          </ModalBody>
          <ModalFooter>
            <VStack align="start" spacing={4}>
              <Checkbox
                isChecked={assignmentCompleted}
                onChange={(e) => setAssignmentCompleted(e.target.checked)}
              >
                Assignment Completed
              </Checkbox>
              <Checkbox
                isChecked={videoCompleted}
                onChange={(e) => setVideoCompleted(e.target.checked)}
              >
                Video Completed
              </Checkbox>
              <Button colorScheme="blue" onClick={handleCloseModal}>
                Close
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Plan;