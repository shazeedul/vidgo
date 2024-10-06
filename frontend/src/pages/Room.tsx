import { useEffect, useRef, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import '../App.css'

function Room() {
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
        const localVideoDiv = document.getElementById('localVideo');

        if (!localStream || localStream.getVideoTracks().length === 0) {
            // Request video stream if not present
            await getMediaStream(!isMuted, true);
            setIsVideoStopped(false);

            // Check if a video element already exists
            let videoElement = localVideoDiv?.querySelector('video');
            if (!videoElement) {
                // Create a new video element if it doesn't exist
                videoElement = document.createElement('video');
                videoElement.autoplay = true;
                videoElement.muted = true;
                videoElement.playsInline = true;
                videoElement.className = "w-full h-full object-cover";
                localVideoDiv?.appendChild(videoElement);
            }

            // Set the video stream to the video element
            if (localStream && videoElement) {
                videoElement.srcObject = localStream;
            }
        } else {
            // Toggle the video track enabled/disabled
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoStopped(!videoTrack.enabled);

            if (!videoTrack.enabled) {
                // If video is disabled, remove the video element
                const videoElement = localVideoDiv?.querySelector('video');
                if (videoElement) {
                    videoElement.srcObject = null; // Remove the video stream from the element
                    videoElement.remove(); // Remove the video element from the DOM
                }
            } else {
                // If video is enabled, reattach the stream to the video element
                let videoElement = localVideoDiv?.querySelector('video');
                if (!videoElement) {
                    // Create the video element if it's missing
                    videoElement = document.createElement('video');
                    videoElement.autoplay = true;
                    videoElement.muted = true;
                    videoElement.playsInline = true;
                    videoElement.className = "w-full h-full object-cover";
                    localVideoDiv?.appendChild(videoElement);
                }

                // Attach the stream again if re-enabled
                if (localStream && videoElement) {
                    videoElement.srcObject = localStream;
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
                        <video ref={localVideoRef} autoPlay className="w-full h-full object-cover" playsInline />
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

export default Room
