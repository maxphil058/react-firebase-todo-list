

import React from 'react';
import { dbRef } from './firebase-config/firebase';
import { tasksDb } from './firebase-config/firebase';
import { useEffect } from 'react';
import { doc, getDocs, onSnapshot, query, updateDoc, where, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import { auth } from './firebase-config/firebase';
import { useNavigate } from 'react-router-dom';

function Output() {
    const [taskData, setTaskData] = useState([]);
    const [filterCategory, setFilterCategory] = useState("");
    const [doneTaskId, setDoneTaskId] = useState("");
        const [doneTask, setDoneTask] = useState(false);


    const navigate = useNavigate();
    const myId = auth?.currentUser?.uid;

    useEffect(() => {
        filterTask();
    }, [filterCategory]);

    useEffect(() => {
        if (!myId) return;

        const myOwnData = query(dbRef, where("userID", "==", myId));

        const unsubscribe = onSnapshot(myOwnData, (realTimeData) => {
            const data = realTimeData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }));
            setTaskData(data);
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [myId]);

    async function deleteTask(id) {
        let toDoRef = doc(tasksDb, "tasks", id);
        await deleteDoc(toDoRef);
    }

    async function completeTask(id) {

        setDoneTaskId(id);
        setDoneTask(!doneTask);

        await updateDoc(doc(tasksDb, "tasks", id), { completed: !doneTask });


//         await updateDoc(doc(tasksDb, "tasks", id), { completed: true });

    }

    async function filterTask() {
        try {
            if (filterCategory === "all") {
                let all = await getDocs(dbRef);
                const allCategory = all.docs.map((doc) => {
                    return { ...doc.data(), id: doc.id };
                });
                setTaskData(allCategory);
            } else {
                const q = query(dbRef, where("category", "==", filterCategory));
                let filtered = await getDocs(q);
                const category = filtered.docs.map((doc) => {
                    return { ...doc.data(), id: doc.id };
                });
                setTaskData(category);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function pickCategory(e) {
        let newCat = e.target.value;
        setFilterCategory(newCat);
    }

    function handleFullTask(id, task) {
        navigate("/task", { state: { id, task } });
    }

    return (
        <div className='output-wrapper mt-4 border-4 rounded-2xl h-auto border-white max-w-full font-mono'>
            <div className='mx-auto w-1/4 mt-4'>
                <select className='cursor-pointer mb-4 mx-auto' required value={filterCategory} onChange={(e) => pickCategory(e)}>
                    <option className='text-center' value="all">All</option>
                    <option className='text-center' value="personal">Personal</option>
                    <option className='text-center' value="work">Work</option>
                    <option className='text-center' value="school">School</option>
                    <option className='text-center' value="family">Family</option>
                </select>
            </div>

            {taskData.length > 0 ? (
                taskData.map((task, index) => (
                    <ul className='flex flex-col py-6 px-2 md:px-7 text-2xl z-10 text-white list-disc' key={index}>
                        <li className={`flex relative flex-row pt-7 pb-9  gap-4 flex-1 border-b-4 border-gray-500 `}>                      
                        <span  className='category uppercase inline-block text-sm absolute'>{task.category}</span>
                            <span className={(task.dueDate || task.dueTime) ? "due-date inline-block text-sm absolute  " : ""}>
                                    {!task.dueDate && !task.dueTime ? null : 
                                    !task.dueTime && task.dueDate ? `Due ${task.dueDate}` : 
                                    !task.dueDate && task.dueTime ? `Due ${task.dueTime}` : 
                                    ` Due ${task.dueDate} at ${task.dueTime} `}
                                </span>
                            <div className='relative max-w-full w-full overflow-hidden whitespace-nowrap text-ellipsis flex items-center'>
                               
                                <div className='overflow-hidden max-w-full w-full'>
                                    <div className='max-w-full overflow-hidden whitespace-wrap cursor-pointer relative' 
                                        >
                                        {task.completed ? (
                                            <span onClick={() => handleFullTask(task.id, task.task)} className="line-through inline-block w-full">{task.task}</span>
                                        ) : (
                                            <span onClick={() => handleFullTask(task.id, task.task)} className='ellipses font-semibold inline-block w-full'>{task.task}</span>
                                        )}
                                    </div>
                                </div>
                               
                            </div>

                            <span className="flex flex-row items-center gap-4 md:gap-1 relative">
                                <i className="fa-solid fa-trash text-red-300 md:hover:text-red-900 cursor-pointer transform md:hover:scale-125" onClick={() => deleteTask(task.id)}></i>
                                <i className="fa-regular fa-circle-check md:mx-8 cursor-pointer md:hover:text-black transform md:hover:scale-125" onClick={() => { completeTask(task.id) }}></i>
                                <span className='view bg-blue-950 rounded-2xl px-2 ' onClick={() => handleFullTask(task.id, task.task)}>Expand <i className="fa-solid fa-expand "></i></span>
                            </span>
                        </li>
                    </ul>
                ))
            ) : (
                <div className="grid place-items-center">
                    <h1 className='text-4xl text-white'>No data yet</h1>
                    <i className="fas fa-spinner fa-spin text-6xl mt-8 mb-8 text-white"></i>
                </div>
            )}
        </div>
    );
}

export default Output;