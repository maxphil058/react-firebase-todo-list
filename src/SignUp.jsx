import React from 'react'
import { useState } from 'react';
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { auth } from './firebase-config/firebase';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { dbRef } from './firebase-config/firebase';


import { tasksDb } from './firebase-config/firebase';
import { useEffect } from 'react';

function SignUp() {

    const navigate = useNavigate()

    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")
    const [userName,setUserName]= useState("")  


     async function  handleSubmit(e) {

        e.preventDefault();

        try {
            
            let stringUserName = String(userName)
            let stringPassword = String(password)
            let stringEmail = String(email)
            
            const passwordCheck = stringPassword.split("")
             


             if( stringPassword.trim()==="" && stringUserName.trim()==="" && stringEmail.trim()===""){
                return Swal.fire({
                    icon: "error",
                    title: "Form empty",
                    text: "Your form is empty!",
                  });
            }
            else if( stringEmail.trim()===""  ){
                return Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong with email!",
                  });
            }
            else if(stringUserName.trim()===""){
                return Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong with username!",
                  });
            }
            else if( stringPassword.trim()===""){
                return Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong with password!",
                  });
            }
            else if( passwordCheck.length<6){
                return Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "password less than 6 characters",
                  });
            }

            else{
                

                
               let userInfoRef= await addDoc(collection(tasksDb,"user-info"), {
                    username:userName,
                    email:email,
                    password:password,
                    profileColor: "blue"
    
    
                })

                let loginCredential = await createUserWithEmailAndPassword(auth, email,password)
                let login = loginCredential.user
                const loginID= login.uid

                
                Swal.fire({
                    title: "Good job!",
                    text: "You have an account!",
                    icon: "success"
                  });


                 updateDoc(userInfoRef,{
                    id: loginID

                 })

                  navigate("/login")

                  
          
          
          
                }

            
                
            

        } catch (error) {
            console.log(error)
        }
        


    }
  return (
    <>
        <div className="login-wrapper min-h-screen grid place-items-center py-4 font-mono bg-blue-800">
            <form action="" className=' rounded-2xl flex flex-col gap-8 w-10/12 bg-blue-900 text-white p-8  '>
                <h1 className=' transform hover:scale-125 text-3xl text-center font-bold font-mono'> SIGN UP</h1>
                <label  className="p-4  transform hover:scale-125 md:hover:scale-110 text-lg "htmlFor="username">USERNAME</label>
                <input type="text" id='username' className="hover:bg-gray-500 p-4 rounded-2xl text-gray-800 hover:text-white" value={userName} onChange={(e)=>setUserName(e.target.value)}  required placeholder="type your username.." /> 

                <label  className="p-4  transform hover:scale-125 md:hover:scale-110 text-lg "htmlFor="email">EMAIL</label>
                <input type="email" id='email' className="hover:bg-gray-500 p-4 rounded-2xl text-gray-800 hover:text-white" value={email} onChange={(e)=>setEmail(e.target.value)}  required placeholder="type your email.." /> 

                <label className="p-4  transform hover:scale-125 md:hover:scale-110 text-lg  " htmlFor="password">PASSWORD</label>
                <input type="password" id='password' className=" hover:text-white hover:bg-gray-500 p-4 rounded-2xl text-gray-800 " value={password} onChange={(e)=>setPassword(e.target.value)} required  placeholder="type your password.." /> 

                
                <button onClick={handleSubmit} className='border-4 border-gray-600 w-2/5 rounded-2xl hover:border-white  mx-auto py-2' >Sign up</button>
            </form>
        </div>
    </>
  )
}

export default SignUp