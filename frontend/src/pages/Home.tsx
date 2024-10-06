import { useState } from 'react'

function Home() {
    const [email, setEmail] = useState('');
    const [roomId, setRoomId] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email && roomId) {
            console.log(`Joining room ${roomId} with email ${email}`);
            // Handle room join logic here
        } else {
            alert('Please fill in both fields.');
        }
    };
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h1 className="text-3xl font-extrabold text-white text-center mb-6">Join a Room</h1>
                    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-email">
                                    Email
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-email" type="text" defaultValue="" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-password">
                                    Room ID
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-room-id" type="text" placeholder='12345678' onChange={(e) => setRoomId(e.target.value)} />
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
                </div>
            </div>
        </>
    )
}

export default Home
