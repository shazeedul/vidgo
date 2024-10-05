import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const [isMuted, setIsMuted] = useState(true)
  const [isVideoStopped, setIsVideoStopped] = useState(true)
  const [micError, setMicError] = useState(true)
  const [videoError, setVideoError] = useState(true)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    checkMicOrVideoError()
  }, [])

  // check mic or video is error for connect device
  const checkMicOrVideoError = () => {
    // check media devices audio not available
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setMicError(false)
      })
      .catch(() => {
        setMicError(true)
        // disable #mic-button
        const micButton = document.getElementById('mic-button')
        if (micButton) {
          micButton.setAttribute('disabled', 'true')
        }
      })
    // check media devices video not available
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setVideoError(false)
      })
      .catch(() => {
        setVideoError(true)
        // disable #video-button
        const videoButton = document.getElementById('video-button')
        if (videoButton) {
          videoButton.setAttribute('disabled', 'true')
        }
      })
  }

  // Function to get media stream with optional audio and video
  const getMediaStream = async (audio: boolean, video: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio, video });
      if (localStream) {
        // If we already have a stream, update it by adding new tracks
        if (audio && stream.getAudioTracks().length > 0) {
          localStream.addTrack(stream.getAudioTracks()[0]);
        }
        if (video && stream.getVideoTracks().length > 0) {
          localStream.addTrack(stream.getVideoTracks()[0]);
        }
      } else {
        // If there's no existing stream, set the new stream
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  // Toggle microphone audio on/off
  const toggleMute = async () => {
    if (!localStream || localStream.getAudioTracks().length === 0) {
      await getMediaStream(true, !isVideoStopped);
      setIsMuted(false);
    } else {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = async () => {
    if (!localStream || localStream.getVideoTracks().length === 0) {
      await getMediaStream(!isMuted, true);
      setIsVideoStopped(false);

      // Create and append the video element if not already present
      const videoElement = document.createElement('video');
      videoElement.autoplay = true;
      videoElement.muted = true;
      videoElement.className = "w-full h-full object-cover";
      videoElement.playsInline = true;
      videoElement.srcObject = localStream; // Set the video stream
      const localVideoDiv = document.getElementById('localVideo');
      if (localVideoDiv) {
        localVideoDiv.appendChild(videoElement); // Append the video element
      }
    } else {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoStopped(!videoTrack.enabled);
      const localVideoDiv = document.getElementById('localVideo');

      if (videoTrack.enabled) {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream; // Ensure video stream is attached
        }
      } else {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null; // Remove video when disabled
        }
        const videoElement = localVideoDiv?.querySelector('video');
        if (videoElement) {
          videoElement.remove(); // Remove the video element
        }
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Video Conferencing</h1>
        </div>
        {/* Main Video Section */}
        <div
          className="flex-grow flex flex-col lg:flex-row items-center justify-center p-4 space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Local Video */}
          <div className="w-full lg:w-1/2 bg-black rounded-md overflow-hidden" id="localVideo">
            {/* <video ref={localVideoRef} autoPlay className="w-full h-full object-cover" playsInline /> */}
          </div>
          {/* Remote Video */}
          <div className="w-full lg:w-1/2 bg-black rounded-md overflow-hidden">
            <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover" playsInline />
          </div>
        </div>
        <div className="space-x-4">
          <button className={`py-2 px-4 rounded ${!isMuted ? "bg-green-500" : "bg-red-500"} text-white`} id='mic-button'
            onClick={toggleMute}>
            {!isMuted ? "Mute" : "Unmute"}
            {micError && (
              <span className="ml-2">
                &nbsp;<i className="fi fi-sr-triangle-warning"></i>
              </span>
            )}
          </button>
          <button className={`py-2 px-4 rounded ${!isVideoStopped ? "bg-green-500" : "bg-red-500"} text-white`} id='video-button' onClick={toggleVideo}>
            {!isVideoStopped ? "Stop Video" : "Start Video"}
            {videoError && (
              <span className="ml-2">
                &nbsp;<i className="fi fi-sr-triangle-warning"></i>
              </span>
            )}
          </button>
          <button className="py-2 px-4 rounded bg-red-600 text-white">Leave Meeting</button>
        </div>
      </div>
    </>
  )
}

export default App
