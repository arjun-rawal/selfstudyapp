import { AspectRatio } from "@chakra-ui/react";
import React from "react";

/** 
 * Component to display the youtube video used in each day in the plan
 * @param {url} url to be displayed
 * @returns jsx component of the embedded video to be displayed
 */
const YouTubeEmbed = ({ url }) => {

  /* 
  * Extract the video ID from the YouTube URL
  */
  const formatEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return null; 
  };

  const embedUrl = formatEmbedUrl(url);

  if (!embedUrl) {
    return <p>Invalid YouTube URL</p>;
  }

  return (
    <AspectRatio ratio={4 / 3} rounded="lg" overflow="hidden">
    <iframe
      src={embedUrl}
      title="YouTube video player"
      allowFullScreen
    ></iframe>
    </AspectRatio>
  );
};

export default YouTubeEmbed;
