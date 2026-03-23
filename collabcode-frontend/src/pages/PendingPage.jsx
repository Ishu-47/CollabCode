import { useEffect, useState } from "react";
import { approveUser, getPendingUsers, rejectUser } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function PendingPage() {

    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await getPendingUsers(roomCode);
            setUsers(res.data);
        } catch (err) {
            navigate(`/room/${roomCode}`); // not host
        }
    };

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 3000);
        return () => clearInterval(interval);
    }, [roomCode]);

    const handleApprove = async (id) => {
        await approveUser(id);
        fetchUsers();
    };

    const handleReject = async (id) => {
        await rejectUser(id);
        fetchUsers();
    };

    return (
        <div className="h-screen bg-gray-900 text-white p-6">

            <button
                onClick={() => navigate(`/room/${roomCode}`)}
                className="mb-4 bg-gray-700 px-3 py-1 rounded"
            >
                ← Back
            </button>

            <h1 className="text-xl font-bold mb-4">
                Pending Requests
            </h1>

            {users.length === 0 && (
                <p className="text-gray-400">No pending users</p>
            )}

            {users.map((u) => (
                <div
                    key={u.id}
                    className="flex justify-between bg-gray-800 p-3 mb-2 rounded"
                >
                    <span>{u.username}</span>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleApprove(u.id)}
                            className="bg-green-500 px-3 rounded"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => handleReject(u.id)}
                            className="bg-red-500 px-3 rounded"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ))}

        </div>
    );
}