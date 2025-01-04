import React, { useEffect, useRef } from 'react';

/** 
 * Component to handle the Vast Video format for the video ads
 * @param {vastURL} vastUrl to be handled
 * @param {handleCompelete} function to be called on ad end
 * @returns jsx component of the video to be displayed on frontend
 */
const VastVideoPlayer = ({ vastUrl, handleComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVastAd = async () => {
      try {
        const response = await fetch(vastUrl);
        const vastXml = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(vastXml, 'application/xml');
        const mediaFile = xmlDoc.querySelector('MediaFile');

        if (mediaFile) {
          const videoSrc = mediaFile.textContent.trim();
          if (videoRef.current) {
            videoRef.current.src = videoSrc;
          }
        } else {
          console.error('No MediaFile found in the VAST response.');
        }
      } catch (error) {
        console.error('Error fetching or parsing VAST XML:', error);
      }
    };

    if (vastUrl) {
      fetchVastAd();
    }
  }, [vastUrl]);

  const onEnded = () => {
    console.log("ENDED HERE")
    handleComplete();
    
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        width="640"
        height="360"
        onEnded={onEnded}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VastVideoPlayer;
