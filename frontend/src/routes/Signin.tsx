import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [invalid, setInvalid] = useState(false);
    const [found, setFound] = useState(true);
    useEffect(() => {
        axios.get("http://localhost:5000/api/v1/user/me", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(() => {
                navigate('/');
            }).catch(() => {
                navigate('/signin');
            })
    }, [])

    return <div className="flex items-center justify-center min-h-screen w-screen">
        <div className='rounded-md p-4 pt-8 bg-white'>
            <div className='text-3xl font-bold flex justify-center mb-1 text-black'>Log in</div>
            <div className='text-gray-500 flex justify-center mb-4'>Enter your information to access your account</div>
            <div className="font-semibold mb-1 text-slate-600">
                Email
            </div>
            <div className="bg-white">
                <input placeholder="xyz@gmail.com" onChange={(e) => {
                    setEmail(e.target.value);
                }} className="border border-slate-200 w-full rounded-sm p-1 mb-2 active:border-blue-500"></input>
            </div>
            {email === '' && <div className="text-red-500" >Email is required</div>}
            <div className="font-semibold mb-1 text-slate-600 mt-4">
                Password
            </div>
            <div>
                <input placeholder="123456" onChange={(e) => {
                    setPassword(e.target.value);
                }} className="border border-slate-200 w-full rounded-sm p-1 mb-2 active:border-blue-500"></input>
            </div>
            {password === '' && <div className="text-red-500">Password is required</div>}
            <button onClick={() => {
                axios.post("http://localhost:5000/api/v1/user/signin", {
                    email: email,
                    password: password
                }).then((res) => {
                        localStorage.setItem("token", res.data.token);
                        navigate('/'); // Redirect to home page 
                }).catch((error)=>{
                    if(error.response.status === 401){
                        setFound(true);
                        setInvalid(true);
                    }
                    else if(error.response.status === 404){
                        setInvalid(false);
                        setFound(false);
                    }
                })
            }} className='bg-gray-950 text-white w-full mt-4 mb-3 p-2 rounded-md hover:bg-gray-800 font-medium'>Sign in</button>
            {invalid && <div className="text-red-500 text-center font-bold">Invalid email or password</div>}
            {!found && <div className="text-red-500 text-center font-bold">User not found</div>}
            <div className='text-center text-black'>Don't have an account?<a className='hover:text-blue-800 font-normal' href='http://localhost:5173/signup'>&nbsp;Signup</a></div>
        </div>
    </div>
}