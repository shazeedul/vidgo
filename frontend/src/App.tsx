import { Routes, Route } from "react-router-dom";
import { SocketProvider } from "./providers/Socket";
import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
  return (
    <>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:uuid" element={<Room />} />
        </Routes>
      </SocketProvider>
    </>
  )
}

export default App
