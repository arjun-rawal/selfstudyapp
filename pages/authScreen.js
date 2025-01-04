import { Button, Center, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import Login from "../myComponents/login";
import Signup from "../myComponents/signup";
import { useState } from "react";
import GoogleSignInButton from "../myComponents/googleSignInButton";

/**
 * Combines the login, signup, and google button component to the authScreen page
 * @returns jsx component
 */
export default function AuthScreen() {
  const [account, setAccount] = useState(true);

  const Card = () => {
    if (!account) {
      return (
        <Stack>
          <Signup />
          <Button
            onClick={() => {
              setAccount(true);
            }}
          >
            Already have an account? Log in.
          </Button>
        </Stack>
      );
    } else {
      return (
        <Stack>
          <Login />
          <Button
            onClick={() => {
              setAccount(false);
            }}
          >
            {" "}
            Don&apos;t have an account? Signup.
          </Button>
        </Stack>
      );
    }
  };

  return (
    <>
      <Center width="100vw" height="80vh">
        <Stack>
          <Card />
          <Center>
            <VStack>
              <GoogleSignInButton />
            </VStack>
          </Center>
        </Stack>
      </Center>
    </>
  );
}
