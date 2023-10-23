import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAtom } from 'jotai'
import { atomWithStorage, } from 'jotai/utils'
import { app } from "../firebase";

export const userAtom = atomWithStorage('user', null)

export default function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(true);

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

  return { user, loading }
}