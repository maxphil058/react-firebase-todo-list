

import Input from "./Input";
import Output from "./Output";
import { useNavigate } from "react-router-dom";
import { auth, dbRef } from "./firebase-config/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, collection, doc, getDoc, query, where, onSnapshot } from "firebase/firestore";
import { tasksDb } from "./firebase-config/firebase";

export default function ToDo() {
  const [myUsername, setMyUsername] = useState("");
  const [firstLetter, setFirstLetter] = useState("");
  const [inputActive, setInputActive] = useState(false);
  const [inputColour, setInputColour] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [newColour, setNewColour] = useState("");
  const [completedNos, setCompletedNos] = useState(1);
  const [scale, setScale] = useState(false); // State for scaling effect

  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const userId = user?.uid;

  useEffect(() => {
    async function getId() {
      if (!userId) return;

      const docRef = doc(tasksDb, "user-info", userId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setDocumentId(docSnapshot.id); // Set documentId to the userId
      }
    }

    getId();
  }, [userId]);

  useEffect(() => {
    async function getUsername() {
      if (!userId) return;

      let allUserInfos = await getDocs(collection(tasksDb, "user-info"));
      const allUserObj = allUserInfos.docs.map((doc) => ({ ...doc.data() }));

      let myUserInfo = allUserObj.find((obj) => obj.id === userId);
      setMyUsername(myUserInfo?.username);

      if (myUserInfo?.username) {
        let first = myUserInfo.username[0].toUpperCase();
        setFirstLetter(first);
      }
    }

    getUsername();
  }, [userId]);

  async function handleSignOut() {
    await signOut(auth);
    navigate("/");
  }

  function handleChangeInputActive() {
    setInputActive(!inputActive);
  }

  function handleColor(e) {
    setInputColour(e.target.value);
  }

  useEffect(() => {
    if (!userId) return;
    const q = query(dbRef, where("userID", "==", userId), where("completed", "==", false));
    let unsubscribe = onSnapshot(q, (realTimeData) => {
      const data = realTimeData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCompletedNos(data.length);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  // Function to handle touch start
  const handleTouchStart = () => {
    setScale(true); // Set scale to true on touch start
  };

  // Function to handle touch end
  const handleTouchEnd = () => {
    setScale(false); // Set scale to false on touch end
  };

  return (
    <>
      <main className="main-wrapper bg-blue-900 pt-4 px-2 min-h-screen pb-12">
        <div className="flex flex-row justify-between items-end px-4 py-4 ">
          <div className="relative">
            <div
              style={{ backgroundColor: newColour || inputColour }}
              className="user-letter text-6xl flex flex-row justify-center relative text-white border-white border-4 text-center"
              onClick={handleChangeInputActive}
            >
              <p>{firstLetter}</p>
            </div>
            {inputActive && (
              <span className="absolute input-container">
                <p className="text-sm text-center">Change color</p>
                <input
                  type="color"
                  onChange={handleColor}
                  className="color-input inline-block cursor-pointer"
                  style={{ backgroundColor: inputColour, borderColor: inputColour, borderWidth: "0" }}
                />
              </span>
            )}
            <p className="text-green-700 mt-3 font-bold">Logged in... {myUsername}</p>
          </div>

          <button
            onClick={handleSignOut}
            className="text-red-500 border-2 p-2 h-2/5 rounded-2xl hover:text-white hover:border-blue-900"
          >
            log out
          </button>
        </div>

        <Input />

        {completedNos > 0 ? (
          <div className="text-red-600 font-semibold text-2xl mt-4 text-center">
            <i
              className={`fas fa-bell hover:scale-125 transform ${scale ? "scale-125" : "scale-100"} transition-transform duration-200`}
              onTouchStart={handleTouchStart} // Trigger on touch start
              onTouchEnd={handleTouchEnd} // Trigger on touch end
            ></i>
            <p>You have {completedNos} left</p>
          </div>
        ) : (
          <div className="text-white font-semibold text-2xl mt-4 text-center">
            <i className={`fas fa-glass-cheers hover:scale-125 transform ${scale ? "scale-125" : "scale-100"} transition-transform duration-200` } onTouchStart={handleTouchStart} // Trigger on touch start
              onTouchEnd={handleTouchEnd}  ></i>
            <p>Done with all your tasks bud!!</p>
          </div>
        )}
        <Output />
      </main>
    </>
  );
}
