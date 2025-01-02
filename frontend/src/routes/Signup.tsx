import { useState, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom"

export function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [invalid, setInvalid] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("http://localhost:5000/api/v1/user/me", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(() => {
            navigate('/');
        }).catch(() => {
            navigate('/signup');
        })
    }, [])

    return <div className='flex items-center justify-center h-screen'>
        <div className='rounded-md p-4 pt-8 bg-white'>
            <div className='text-3xl font-bold flex justify-center mb-1 text-black'>Sign up</div>
            <div className='text-gray-500 flex justify-center mb-4'>Enter your information to create an account</div>
            <div className="font-semibold mb-1 text-slate-600">
                First Name
            </div>
            <div className="bg-white">
                <input placeholder="John" onChange={(e) => {
                    setFirstName(e.target.value);
                }} className="border border-slate-200 w-full rounded-sm p-1 mb-2 active:border-blue-500"></input>
            </div>
            {firstName === '' && <div className="text-red-500" >First Name is required</div>}
            <div className="font-semibold mb-1 text-slate-600">
                Last Name
            </div>
            <div className="bg-white">
                <input placeholder="Doe" onChange={(e) => {
                    setLastName(e.target.value);
                }} className="border border-slate-200 w-full rounded-sm p-1 mb-2 active:border-blue-500"></input>
            </div>
            {lastName === '' && <div className="text-red-500" >Last Name is required</div>}
            <div className="font-semibold mb-1 text-slate-600">
                Email
            </div>
            <div className="bg-white">
                <input placeholder="xyz@gmail.com" onChange={(e) => {
                    setEmail(e.target.value);
                }} className="border border-slate-200 w-full rounded-sm p-1 mb-2 active:border-blue-500"></input>
            </div>
            {email === '' && <div className="text-red-500" >Email is required</div>}
            <div className="font-semibold mb-1 text-slate-600">
                Password
            </div>
            <div>
                <input placeholder="123456" onChange={(e) => {
                    setPassword(e.target.value);
                }} className="border border-slate-200 w-full rounded-sm p-1 mb-2 active:border-blue-500"></input>
            </div>
            {password === '' && <div className="text-red-500" >Password is required</div>}
            <button onClick={() => {
                axios.post("http://localhost:5000/api/v1/user/signup", {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName
                }).then((res) => {
                    localStorage.setItem("token", res.data.token);
                    navigate('/');
                }).catch((error) => {
                    if (error.response.status === 409) {
                        setInvalid(true);
                    }
                })
            }} className='bg-gray-950 text-white w-full mt-4 mb-3 p-2 rounded-md hover:bg-gray-800 font-medium'>Sign up</button>
            {invalid && <div className="text-red-500 text-center font-bold">Email already exists</div>}
            <div className='text-center text-black'>Already have an account?<a className='hover:text-blue-800 font-normal' href='http://localhost:5173/signin'>Login</a></div>
        </div>
    </div>
}