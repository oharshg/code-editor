import { useNavigate } from "react-router-dom";

export default function LoginButton() {
    const navigate = useNavigate();
    return <div>
        <button className="btn btn-primary" onClick={()=>{
                navigate('/signin');
            }}>Log In</button>
    </div>
}