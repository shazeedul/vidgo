import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSocket } from "../providers/Socket"

function Home() {
    const [roomId, setRoomId] = useState('');

    const { socket } = useSocket();

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (roomId) {
            console.log(`Joining room ${roomId}`);
            // Handle room join logic here
            // Store the room ID in local storage
            localStorage.setItem('roomId', roomId)
            socket.emit("join-room", {
                roomId
            })
            navigate(`/room/${roomId}`)

        } else {
            alert('Please fill in both fields.');
        }
    };

    const createRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        console.log('Creating room...');
        // Handle room creation
        // Generate a random room ID concatenate with time
        const randomRoomId = Math.random().toString(36).substring(7) + '-' + Math.random().toString(36).substring(7) + '-' + Math.random().toString(36).substring(7) + '-' + Math.random().toString(36).substring(7);
        // Store the room ID in local storage
        localStorage.setItem('roomId', randomRoomId)
        navigate(`/room/${randomRoomId}`)
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h1 className="text-3xl font-extrabold text-white text-center mb-6">Join a Room</h1>
                    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-password">
                                    Room ID
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-room-id" type="text" placeholder='37d35-6f809-4e647-ef48a' onChange={(e) => setRoomId(e.target.value)} />
                            </div>
                        </div>
                        <div className="md:flex md:items-center">
                            <div className="md:w-1/3"></div>
                            <div className="md:w-2/3">
                                <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                                    Join
                                </button>
                            </div>
                        </div>
                    </form>
                    <br />
                    <h1 className='text-3xl font-extrabold text-white text-center mb-6'>Create Room</h1>
                    <div className="flex justify-center">
                        {/* Create Room Button */}
                        <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onClick={createRoom}>
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
