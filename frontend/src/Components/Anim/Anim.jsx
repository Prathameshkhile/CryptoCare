import React, { useRef, useEffect } from "react";
import styles from "./Anim.module.css";

export const Anim = ({ offAnim }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
      video.addEventListener("ended", offAnim);
    }

    return () => {
      if (video) {
        video.removeEventListener("ended", offAnim);
      }
    };
  }, [offAnim]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <video
          ref={videoRef}
          className={styles.video}
          src="/animation.mp4" // ✅ Public folder asset
          type="video/mp4"
          controls={false}
          muted
        />
      </div>
    </div>
  );
};
