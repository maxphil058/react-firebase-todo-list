import {useAuthState} from "react-firebase-hooks/auth"
import { useState } from 'react'
import {addDoc } from  'firebase/firestore'

import { auth } from "./firebase-config/firebase"
import { serverTimestamp } from "firebase/firestore"
import { dbRef } from "./firebase-config/firebase"

function Input( ) {


    const [user] =    useAuthState(auth)

        const userId= user?.uid

    const [input,setInput] = useState("")
    const [category,setCategory] = useState("")
    const [dueDate,setDueDate]=useState("")
    const [dueTime,setDueTime]=useState("")



   async function addTask() {


    if(input.trim()==="" ){ return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Write a text",
      }); }

      if(category==="" ){ return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Pick category",
      }); }

      
    await addDoc(dbRef,{     task:input,
                             category:category,
                             userID:userId,
                             completed:false,
                             createdAt: serverTimestamp(),
                             dueDate:dueDate? dueDate:null,
                             dueTime:dueTime?dueTime:null

                            }) ;

    setInput("")
    setCategory("")
    setDueDate("")
    setDueTime("")
   }




  return (

    <div className="input-wrapper border-4 rounded-2xl border-white  md:px-20 flex flex-col justify-center items-center ">
        <h1 className='text-4xl text-center mt-8  text-white font-bold '>TODO LIST</h1>

       <section className='    w-full flex   flex-row gap-4 justify-center items-center ml-1 px-2'>
      
       <input type="text" className=' input-task  w-full  border-4 mt-8  cursor-text p-2 text-center  rounded-2xl md:text-lg  '  placeholder='TYPE TASK..'   onChange={e=>setInput(e.target.value)}   value={input} />

       <div className=' input-side  mt-12 flex flex-col   '>
            
          <div className="flex flex-col items-end">
             <select   className=" cursor-pointer w-5/6 md:w-full bg-slate-500 text-white font-bold py-1 px-1 rounded-2xl   text-center  "  required name="" id="" value={category} onChange={(e)=>{setCategory(e.target.value)}}> 
                
                <option disabled value=""  >Categories..</option>
                <option value="personal" >Personal</option>
               <option value="work"> Work</option>
               <option value="school">School</option>
               <option value="family">Family</option>

             </select>
          </div>

         <div className="flex flex-col items-end">
            <p className=" text-white my-1 font-bold text-center self-center ">Due date:</p>
            <input type="date" className="cursor-pointer  text-center w-5/6 md:w-full bg-slate-500 text-white font-bold py-1 px-1 rounded-2xl right-i  "   value={dueDate}  onChange={(e)=>{ return setDueDate(e.target.value)}}  />
          </div>   

           <div className="flex flex-col items-end">
            <p className=" text-white my-1 font-bold text-center self-center ">Time:</p>
            <input type="time" className="cursor-pointer text-center   bg-slate-500 text-white font-bold py-1 px-1 rounded-2xl w-5/6 md:w-full right-i  "   value={dueTime}  onChange={(e)=>{ return setDueTime(e.target.value)}}  />
          </div>             

       </div>

       </section>

        <button className='mt-4 border-4 hover:bg-blue-950  text-xl mb-4 p-2  rounded-2xl  cursor-pointer text-white   '  onClick={addTask}> Add task</button>
      
       

    </div>
  )
}

export default Input
