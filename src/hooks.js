import {useState, useEffect} from "react";

export default function useAuthState(auth){
  const[user, SetUser] = useState(() => auth.currentUser );
  const[initializing, SetInitializing] = useState(true);

  useEffect(() => {
    const subscribe = auth.onAuthStateChanged((user) => {
      if(user){
        SetUser(user);
      }else{
        SetUser(false);
      }
      if(initializing){
        SetInitializing(false);
      }
    });
    return subscribe;
  }, [auth, initializing]);

  return {user, initializing};
}
