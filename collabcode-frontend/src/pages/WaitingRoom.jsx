import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function WaitingRoom(){
    const {roomCode} = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("PENDING")

    useEffect(() => {
        const interval = setInterval()
    })
}