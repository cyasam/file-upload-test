import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { atom, useAtom } from 'jotai'
import { atomWithStorage, } from 'jotai/utils'
import { app } from "../firebase";

export const userAtom = atomWithStorage('user', null)
export const updateAuthAtom = atom({ fn: () => { } })

export default function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(true);
  const [, setUpdateAuth] = useAtom(updateAuthAtom);

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      setLoading(false)

      if (user) {
        const data = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL
        }

        setUser(data);
      } else {
        setUser();
      }
    });
  }, [setUser, setLoading]);



  useEffect(() => {
    const updateAuth = () => {
      const auth = getAuth(app);
      const user = auth.currentUser;

      if (user) {
        const data = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL
        }

        setUser(data);
      } else {
        setUser();
      }
    }

    setUpdateAuth({ fn: updateAuth })
  }, [setUser, setUpdateAuth])

  return { user, loading }
}