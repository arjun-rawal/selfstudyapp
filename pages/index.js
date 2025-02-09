import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Button, Heading, VStack } from "@chakra-ui/react";
import { useState } from "react";
import AuthScreen from "./authScreen.js";
import authMiddleware from "./api/auth/checkAuth.js";
import { useEffect } from "react";
import cookie from "cookie";
import Cookies from "js-cookie";
import { parse } from "cookie";
import FloatingCards from "../myComponents/FloatingCards.js";
import NewTopic from "./newTopic.js";

/**
 * Gets server-side props, used to check if the user is authenticated
 * @param {object} context.req HTTP requeest object, it includes headers and cookies
 * @returns returns a promise with the user object, or null if they aren't authenticated
 */
export async function getServerSideProps(context) {
  const { req } = context;

  try {
    //gets cookies
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const sessionToken = cookies.sessionToken;

    if (!sessionToken) {
      return { props: { user: null } };
    }

    // find user from session token
    const user = await authMiddleware({ cookies });

    console.log("User from authMiddleware:", user);

    return {
      props: { user: user || null },
    };
  } catch (error) {
    console.error("Authentication error:", error.message);
    return {
      props: { user: null },
    };
  }
}

/**
 * "root/base" page that shows everything on /, if the user isn't authenticated it will display pages/authscreen, if they are it will display pages/newTopic,
 *  but it won't actually route to a new page it will just be handled conditionally here
 * @param {user} is the user object
 * @returns react component to display on screen
 */
export default function Home({ user }) {
  const [auth, setAuth] = useState(!!user); //!! makes it false if its null

  /**
   * calls logout api on user clicking log out button
   */
  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
  const Page = () => {
    if (auth) {
      return (
        <>
          <Button
            position={"absolute"}
            left={"90vw"}
            top={"5vh"}
            transform={"translate(0%,0%)"}
            onClick={() => {
              handleLogout();
            }}
          >
            Log out
          </Button>
          <NewTopic user={user} />
        </>
      );
    }
    return <AuthScreen />;
  };

  return (
    <>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2478846957520898"
          crossOrigin="anonymous"
        ></script>
        <title>SelfStudy App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="6a97888e-site-verification"
          content="a368cf15de7f8ec2bb9b30a82b9b425f"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Heading
          textAlign={"center"}
          position={"absolute"}
          left={"50vw"}
          top={"5vh"}
          transform={"translate(-50%)"}
          size="3xl"
        >
          SelfStudy
        </Heading>

        <Page />
        <FloatingCards />
      </main>
    </>
  );
}
