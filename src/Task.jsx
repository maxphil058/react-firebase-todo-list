import React from 'react'
import {collection, serverTimestamp, updateDoc} from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { doc } from 'firebase/firestore'
import { dbRef, tasksDb } from './firebase-config/firebase'
import { useRef } from 'react'
import { useEffect } from 'react'

function Task( ) {

    const textAreaRef = useRef(null)

    const navigate = useNavigate()
    
    const location = useLocation()
    const {id, task} = location.state  || {}
    
    const [textAreaTask,setTextAreaTask] = useState(task)

    async function handleSubmitTextArea (){
        const docRef= doc(tasksDb, "tasks", id)
        await updateDoc(docRef,{
                            task:textAreaTask,
                            editedAt: serverTimestamp()

        })

        navigate("/todo")

    }


    function goBack() {
        navigate(-1)
    }

    function handleInput(){

        textAreaRef.current.style.height=`${textAreaRef.current.scrollHeight}px`
    }

    useEffect(()=>{

    function getOriginalHeight(){

        textAreaRef.current.style.height=`${textAreaRef.current.scrollHeight}px`
    }
     getOriginalHeight()

    },[])
  return (
    <div className="task-wrapper min-h-screen  bg-blue-900">
        
        <i class="fa-solid fa-arrow-left text-white m-4 text-4xl hover:text-gray-700 " onClick={goBack}></i>

       <div className='grid place-items-center min-h-full p-8' >
        <textarea name="" onInput={handleInput} ref={textAreaRef} id="" value={textAreaTask} onChange={(e)=>setTextAreaTask(e.target.value)} className= 'capitalize overflow-hidden text-white text-3xl  border-4 border-white   rounded-2xl  min-w-full block bg-blue-900 p-4 ' >
            </textarea>

            <button className='border-4  text-white  capitalize bg-blue-950 hover:border-gray-600 w-2/5  rounded-2xl border-white mb-12 mt-4 py-2' onClick={handleSubmitTextArea}>edit</button>
       </div>

        
    </div>
  )
}

export default Task