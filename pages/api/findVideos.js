const API_KEY = "AIzaSyA6DW5hzFPzZhEkSHZPwBhfBaVVOq4HUfE";
const CX = "c3ade081b62534a67";

/**
 * Uses google search engine api to find a youtube video for each subtopic
 * @param {topics} array of the plans subtopics
 */
async function searchGoogleForLearningLinks(topics) {
  const links = [];

  for (const topic of topics) {
    const query = encodeURIComponent("learn " + topic + " youtube.com video");
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${query}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `Error fetching results for ${topic}: ${response.statusText}`
        );
        continue;
      }

      const data = await response.json();

      const youtubeLinks =
        data.items?.filter((item) => item.link.includes("youtube.com")) || [];

      if (youtubeLinks.length > 0) {
        links.push(youtubeLinks[0].link);
      } else {
        console.warn(`No YouTube results found for ${topic}`);
      }
    } catch (error) {
      console.error(`Error fetching results for ${topic}: ${error.message}`);
    }
  }

  return links;
}

/**
 * Finds youtube videos for each day's subtopics
 * @param {topics} array of the plans subtopics
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { topics } = req.body;

      if (!topics || !Array.isArray(topics) || topics.length === 0) {
        return res
          .status(400)
          .json({ error: "Topics must be a non-empty array." });
      }

      const links = await searchGoogleForLearningLinks(topics);

      return res.status(200).json({ topics, links });
    } catch (error) {
      console.error("Error processing the request:", error.message);
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    return res
      .status(405)
      .json({ error: "Method not allowed. Please use POST." });
  }
}
