// import { RouterProvider,createBrowserRouter,createRoutesFromElements ,Route} from "react-router-dom"
// import ToDo from "./ToDo"
// import LogIn from "./LogIn"
// import Root from "./Root"
// import {useAuthState} from "react-firebase-hooks/auth"
// import { auth } from "./firebase-config/firebase"
// import SignUp from "./SignUp"
// import { Navigate } from "react-router-dom"
// import Task from "./Task"

// function App() {



//     const [user,loading] = useAuthState(auth)

//     const route= createBrowserRouter(createRoutesFromElements(
//         <>
        

//         <Route path="/" element={<Root/>}>

//             <Route  index element={loading?<p>Loading...</p> :user?<Navigate to="todo"/>:<Navigate to="login"/> }  />
//             <Route path="login" element={<LogIn/>} />
            
//             <Route path="sign-up" element={<SignUp/>} />

//             <Route path="todo" element={loading?<p>Loading...</p> :user?<ToDo/>:<Navigate to="/login"/>} />
            
//             <Route path="task" element={ loading?<p>Loading...</p> :user?<Task/>:<Navigate to="/login"/>} />



//         </Route>
//         </>
//     ))

//   return (
//         <RouterProvider router ={route} />
//   )
// }

// export default App

import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import ToDo from "./ToDo";
import LogIn from "./LogIn";
import Root from "./Root";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase-config/firebase";
import SignUp from "./SignUp";
import { Navigate } from "react-router-dom";
import Task from "./Task";

function App() {
    const [user, loading] = useAuthState(auth); // Hook to get user state and loading state

    // Create routes with authentication checks
    const route = createBrowserRouter(createRoutesFromElements(
        <>
            <Route path="/" element={<Root />}>
                <Route 
                    index 
                    element={loading ? <p>Loading...</p> : user ? <Navigate to="todo" /> : <Navigate to="login" />} 
                />
                <Route path="login" element={<LogIn />} />
                <Route path="sign-up" element={<SignUp />} />
                
                <Route 
                    path="todo" 
                    element={
                        loading ? <p>Loading...</p> : user ? <ToDo /> : <Navigate to="/login" />
                    } 
                />
                
                <Route 
                    path="task" 
                    element={
                        loading ? <p>Loading...</p> : user ? <Task /> : <Navigate to="/login" />
                    } 
                />
            </Route>
        </>
    ));

    return (
        <RouterProvider router={route} />
    );
}

export default App;