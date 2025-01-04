import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";





/** 
*Cards that display on the side of the screen
 */
const FloatingCards = () => {
  const [cards, setCards] = useState([]); // Fetch cards
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    async function fetchCards() {
      //send request to get the content for the cards
      try {
        const res = await fetch("/api/getAllPlans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("HERE,",res)

        if (!res.ok) {
          console.error("Failed to fetch cards:", await res.text());
          return;
        }

        const data = await res.json();
        if (data.data.length==0){
          console.log("NO EXAMPLE CARDS")
          const res = await fetch("/api/fillData",{
            method: "POST",
            headers:{
              "Content-Type": "application/json",
            },
            body:JSON.stringify({count: 200})
            
          });
          if (res.ok){
            fetchCards();
          }
        }
        else{
          setCards(data.data || []); // Set the fetched cards
          setIsLoading(false); // Set loading to false after data is fetched
        }





      
      } catch (error) {
        console.error("Error fetching cards:", error);
        setIsLoading(false); 
      }
    }

    fetchCards();
  }, []);

  return (
    <>
      {!isLoading && cards.length > 0 ? (
        <DisplayCards cards={cards} />
      ) : (
        <></>
        )}
    </>
  );
};

const DisplayCards = (props) => {
  const [activeCards, setActiveCards] = useState([]);

  const cards = props.cards;

  const spawnCard = () => {
    
    const randomCard = cards[Math.floor(Math.random() * cards.length)];

    //If the time value is one ("Calculus in 1 days") truncate the last letter(s) so that it's ("Calculus in 1 day") instead
    if (randomCard.text.split("in")[randomCard.text.split("in").length-1].indexOf(1)>-1){
      if (randomCard.text.substring(randomCard.text.length-1, randomCard.text.length) =="s"){
      randomCard.text = randomCard.text.substring(0,randomCard.text.length-1);
      }

    }
    const newCard = {
      ...randomCard,
      spawnId: Date.now(), 
      top: Math.random() * 70 + 15, 
      side: Math.random() > 0.5 ? "left" : "right", 
    };

    setActiveCards((prev) => [...prev, newCard]);

    setTimeout(() => {
      setActiveCards((prev) =>
        //no duplicate card spawning since it cuts the other one off
        prev.filter((item) => item.spawnId !== newCard.spawnId)
      );
    }, 5000); 
  };

  useEffect(() => {
    const interval = setInterval(() => {
      spawnCard();
    }, Math.random() * 1500 +1500); 
    //random time from (1500,3000) ms

    return () => clearInterval(interval); 
  }, [cards]);

  return (
    <Box
      position="absolute"
      top="0"
      zIndex="-1"
      width="100%"
      height="100vh"
      overflow="hidden"
    >
      {activeCards.map((card) => (
        <motion.div
          key={card.spawnId}
          style={{
            position: "absolute",
            top: `${card.top}%`,
            left: card.side === "left" ? "10%" : "auto",
            right: card.side === "right" ? "10%" : "auto",
            width: "15vw",
          }}
          initial={{
            opacity: 0,
            translateY: 20, 
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            translateY: -100,
          }}
          transition={{
            duration: 5, 
            ease: "easeInOut",
          }}
        >
          <Box
            bg="white"
            p={4}
            boxShadow="lg"
            borderRadius="md"
            textAlign="center"
          >
            <Text>{card.text}</Text>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

export default FloatingCards;
