import { useNavigate } from "react-router-dom"

export default function SignupButton() {
    const navigate = useNavigate();
    return (
        <div>
            <button className="btn btn-primary" onClick={()=>{
                navigate('/signup');
            }}>Sign Up</button>
        </div>
    )
}