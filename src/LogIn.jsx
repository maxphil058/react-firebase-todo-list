import React from 'react'
import { useState } from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from './firebase-config/firebase';
import { useNavigate,NavLink } from 'react-router-dom';
import SignUp from './SignUp';
// import { addDoc, collection } from 'firebase/firestore';


// import { tasksDb } from './firebase-config/firebase';


function LogIn() {
    const navigate = useNavigate()

    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")


     async function  handleSubmit(e) {
        e.preventDefault();
        try {
            
            let login = await signInWithEmailAndPassword(auth, email,password)

            login = login.user
            console.log(login)
            navigate("/")
            
            // CHECK OUT HERE id
            

        } catch (error) {
            console.log(error)
            if (error) {
                return   Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Check email or password",
                });
              }
        }
        


    }
  return (
    <>
        <div className="login-wrapper min-h-screen grid place-items-center py-4 font-mono bg-blue-800">
            <form action="" className=' rounded-2xl flex flex-col gap-8 w-10/12 bg-blue-900 text-white p-8  '>
                <h1 className=' transform hover:scale-125 text-3xl text-center font-bold font-mono'> Login</h1>


                <label  className="p-4  transform hover:scale-125 text-lg md:hover:scale-110   "htmlFor="email">EMAIL</label>
                <input type="email" id='email' className="hover:bg-gray-500 p-4 rounded-2xl text-gray-800 hover:text-white" value={email} onChange={(e)=>setEmail(e.target.value)}  required placeholder="type your email.." /> 

                <label className="p-4  transform hover:scale-125 text-lg md:hover:scale-110   " htmlFor="password">PASSWORD</label>
                <input type="password" id='password' className=" hover:text-white hover:bg-gray-500 p-4 rounded-2xl text-gray-800 " value={password} onChange={(e)=>setPassword(e.target.value)} required  placeholder="type your password.." /> 

                <div className='flex justify-center gap-4 '>   
                <button onClick={handleSubmit} className='border-4 border-gray-600 w-2/5  rounded-2xl hover:border-white   py-2' >Submit</button> 

                <NavLink to="/sign-up" className="text-sm mt-5 underline text-gray-400 hover:text-white " > SignUp </NavLink>
                </div>
            </form>
        </div>
    </>
  )
}

export default LogIn