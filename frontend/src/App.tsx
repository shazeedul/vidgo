import { useRef, useState } from 'react'
import './App.css'

function App() {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const [isMuted, setIsMuted] = useState(true)
  const [isVideoStopped, setIsVideoStopped] = useState(true)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  // Function to get media (audio/video)
  const getMediaStream = async (audio: boolean, video: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio, video });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  }
  // Stop all tracks of a specific type (audio or video)
  const stopMediaTracks = (stream: MediaStream, type: "audio" | "video") => {
    stream.getTracks().forEach((track) => {
      if (track.kind === type) {
        track.stop();
      }
    });
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        if (isMuted) {
          // Unmute: request a new audio stream
          getMediaStream(true, !isVideoStopped);
        } else {
          // Mute: stop the audio track
          stopMediaTracks(localStream, 'audio');
        }
        setIsMuted(!isMuted);
      }
    } else if (isMuted) {
      // Request audio stream when unmuting for the first time
      getMediaStream(true, !isVideoStopped);
      setIsMuted(false);
    }
    console.log("audio", isMuted, isVideoStopped);
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        if (isVideoStopped) {
          // Start video: request a new video stream
          getMediaStream(!isMuted, true);
        } else {
          // Stop video: stop the video track
          stopMediaTracks(localStream, 'video');
        }
        setIsVideoStopped(!isVideoStopped);
      }
    } else if (isVideoStopped) {
      // Request video stream when enabling video for the first time
      getMediaStream(!isMuted, true);
      setIsVideoStopped(false);
    }
    console.log("audio", isMuted, isVideoStopped);
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
          <div className="w-full lg:w-1/2 bg-black rounded-md overflow-hidden">
            <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover"
              playsInline />
          </div>

          {/* Remote Video */}
          <div className="w-full lg:w-1/2 bg-black rounded-md overflow-hidden">
            <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover" playsInline />
          </div>
        </div>
        <div className="space-x-4">
          <button className={`py-2 px-4 rounded ${!isMuted ? "bg-green-500" : "bg-red-500"} text-white`}
            onClick={toggleMute}>
            {!isMuted ? "Mute" : "Unmute"}
          </button>
          <button className={`py-2 px-4 rounded ${!isVideoStopped ? "bg-green-500" : "bg-red-500"}
                            text-white`} onClick={toggleVideo}>
            {!isVideoStopped ? "Stop Video" : "Start Video"}
          </button>
          <button className="py-2 px-4 rounded bg-red-600 text-white">Leave Meeting</button>
        </div>


      </div>
    </>
  )
}

export default App
