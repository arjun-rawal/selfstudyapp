import {
  Box,
  Button,
  Card,
  Center,
  Input,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import { StepperInput } from "@/components/ui/stepper-input";
import { useState, useEffect } from "react";
import VideoAd from "@/myComponents/videoAd";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/router";

/**
 * New Topic form where the user can generate a studyplan for themself
 * @param {props.username} username of the authenticated user
 * @param {props.password} password of the authenticated user, we need this because the newPLan api is protected
 * @returns react component of the form
 */
export default function NewTopic(props) {
  const username = props.user?.username || "";
  const password = props.user?.password || "";
  const router = useRouter();


  //Limiting the user to only one plan as of now, if a plan exists, it routes them to the studyPLan page
  useEffect(() => {
    async function fetchData() {

        const result = await getPlan(username);
        if (result.planExists) {
          router.push("/studyPlan")
        }
      
    }
    fetchData();
  }, []);

  async function getPlan(username) {
    if (!username) {
      console.error("No username provided");
      return null;
    }
  
    const res = await fetch("/api/checkPlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
  
    if (!res.ok) {
      console.error("Failed to fetch plan:", await res.text());
      return null;
    }
  
    const data = await res.json();
    return data;
  }






  //I used usestates to handle the form values instead of a form component
  const [timeVal, setTimeVal] = useState("Months");
  const [numVal, setNumVal] = useState(3);
  const [topic, setTopic] = useState("");
  const [validCaptcha, setValidCaptcha] = useState(false);

  const [showAd, setShowAd] = useState(false);
  const [gptCall, setGptCall] = useState(false);
  const [showErrorMessage, setErrorMessage] = useState(false);
  const [showLoading, setShowLoading] = useState(false);


  /**
   * sends form values to submitPlan API
   */
  async function handleNew() {
    console.log(username,password)
    const res = await fetch("/api/submitPlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        topic,
        number: numVal,
        time: timeVal,
      }),
    });

    const data = await res.json();
    console.log(data);
    if (res.ok) {
      setGptCall(true);
    }
    if (!res.ok) {
      alert(data.message);
      if (data.message === "Limit to 1 plan/user"){
        router.push("/studyPlan")
      }
    }
  }

  /**
   * Handles ad and calls above function
   */
  const handleGenerate = () => {
    if (validCaptcha) {
      handleNew();
    } else {
      setErrorMessage(true);
    }
  };

  const handleNumChange = (newVal) => {
    setNumVal(newVal.valueAsNumber);
  };

  const handleAdComplete = () => {
    console.log("AD DONE");
    setShowAd(false);
    setShowLoading(true);
  };

  //if the ad is done(not showing), and openai has returned the call, navigate the user to /studyPLan
  useEffect(() => {
    if (!showAd && gptCall) {
      router.push("/studyPlan");
    }
  }, [showAd, gptCall]);

  return (
    <Center height={"95vh"}>
      <Stack gap="2vh" width="auto">
        {showLoading ? (
          <>
            <Box
              position="fixed"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bg="rgba(0, 0, 0, 0.5)"
              zIndex="999"
            />
            <Center
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex="1000"
            >
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Loading...
                </Text>
              </>
            </Center>
          </>
        ) : (
          <></>
        )}

        {showAd ? (
          <>
            <Box
              position="fixed"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bg="rgba(0, 0, 0, 0.7)"
              zIndex={10}
            />
            <Box zIndex={15}>
              <Text alignSelf={"center"}>Watch this ad to proceed:</Text>
              {/*ad provider takes ~2 weeks to approve, so this is a random temporary ad. When they approve, all we have to do is change this url to their vast url*/}
              <VideoAd
                vastUrl={
                  "https://basil79.github.io/vast-sample-tags/pg/vast.xml"
                }
                handleComplete={handleAdComplete}
              />
            </Box>
            <Box />
          </>
        ) : (
          <>
            <Input
              placeholder="I want to learn..."
              onChange={(e) => {
                setTopic(e.target.value);
              }}
            />
            <Stack
              direction={{ base: "column", md: "row" }}
              margin={"auto"}
              alignItems={"center"}
            >
              <Text whiteSpace={"no-wrap"}> I have...</Text>
              <StepperInput
                value={numVal}
                min={1}
                max={5}
                onValueChange={handleNumChange}
              />
              <MenuRoot positioning={{ placement: "bottom-end" }}>
                <MenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {timeVal}
                  </Button>
                </MenuTrigger>
                <MenuContent>
                  <MenuItem
                    value="Days"
                    onClick={(e) => {
                      setTimeVal(e.target.id);
                    }}
                  >
                    Days
                  </MenuItem>
                  <MenuItem
                    value="Weeks"
                    onClick={(e) => {
                      setTimeVal(e.target.id);
                    }}
                  >
                    Weeks
                  </MenuItem>
                  <MenuItem
                    value="Months"
                    onClick={(e) => {
                      setTimeVal(e.target.id);
                    }}
                  >
                    Months
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            </Stack>
            <ReCAPTCHA
              sitekey="6LeFe5AqAAAAAAFSMOGrpOD_MZvEa06Tup5YYEzh"
              onChange={(value) => {
                setValidCaptcha(value.length > 0);
                console.log("CAPTCHA: ", value.length > 0);
              }}
            />
            {showErrorMessage ? <Text> Captcha Required! </Text> : <></>}
            <Button onClick={handleGenerate}>Generate</Button>

          </>
        )}
      </Stack>
    </Center>
  );
}
