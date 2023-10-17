import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useAtom } from 'jotai'
import { atomWithStorage, } from 'jotai/utils'
import { app } from "../firebase";

export const userAtom = atomWithStorage('user', null)

export default function useAuth() {
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const data = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }

        setUser(data);
      } else {
        setUser();
      }
    });
  }, [setUser]);

  return user
}