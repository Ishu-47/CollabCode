import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMyStatus } from "../api/api";

export default function WaitingRoom() {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("PENDING")

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await getMyStatus(roomCode);
                const newStatus = res.data;

                setStatus(newStatus);

                if (newStatus === "APPROVED") {
                    clearInterval(interval);
                }
                if (newStatus === "REJECTED") {
                    clearInterval(interval);
                    alert("Rejected by host");
                    navigate("/")
                }

            } catch (err) {
                console.error(err);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [roomCode]);

    rreturn(
        <div className="h-screen flex items-center justify-center bg-black text-white">

            <div className="text-center">

                <h1 className="text-3xl font-bold mb-4">
                    Waiting for Approval ⏳
                </h1>

                <p className="text-gray-400">
                    Room: {roomCode}
                </p>

                <div className="mt-6 text-blue-400 animate-pulse">
                    Status: {status}
                </div>

            </div>
        </div>
    );
}