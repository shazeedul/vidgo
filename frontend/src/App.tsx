import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const [isMuted, setIsMuted] = useState(true)
  const [isVideoStopped, setIsVideoStopped] = useState(true)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

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

  // Toggle microphone (request audio stream if not initialized)
  const toggleMute = async () => {
    if (!localStream || localStream.getAudioTracks().length === 0) {
      // If no audio track, request it
      await getMediaStream(true, !isVideoStopped);
      setIsMuted(false);
    } else {
      // Toggle audio track enabled/disabled
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle camera (request video stream if not initialized)
  const toggleVideo = async () => {
    if (!localStream || localStream.getVideoTracks().length === 0) {
      // If no video track, request it
      await getMediaStream(!isMuted, true);
      setIsVideoStopped(false);
    } else {
      // Toggle video track enabled/disabled
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoStopped(!videoTrack.enabled);
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
