import { useRef, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useAtom } from 'jotai';
import { updateAuthAtom, userAtom } from '../../utils/useAuth';
import AnimatedDiv from '../AnimatedDiv';

export default function UpdateUserProfileForm() {
  const [user] = useAtom(userAtom);
  const [{ fn: handleUpdateUser }] = useAtom(updateAuthAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  const nameRef = useRef();

  const handleUpdateUserProfile = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;
    const email = user.email;
    const name = nameRef.current.value;

    if (!email || !name) {
      return;
    }

    try {
      setLoading(true);
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      setLoading(false);
      setError();
      setSuccess(true);

      handleUpdateUser();
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <>
      <form onSubmit={handleUpdateUserProfile}>
        <div className="row">
          <label>Email</label>
          <input
            type="email"
            autoComplete="email"
            disabled={true}
            value={user.email}
            readOnly
          />
        </div>
        <div className="row">
          <label>Name</label>
          <input ref={nameRef} type="text" defaultValue={user.displayName} />
        </div>

        <div className="row bottom">
          <button disabled={loading} type="submit">
            {loading ? 'Loading...' : 'Update User'}
          </button>

          {loading ? (
            <AnimatedDiv className="result loading">Updating...</AnimatedDiv>
          ) : (
            <>
              {error && (
                <AnimatedDiv className="result error">{error}</AnimatedDiv>
              )}
              {success && (
                <AnimatedDiv className="result success">Updated</AnimatedDiv>
              )}
            </>
          )}
        </div>
      </form>
    </>
  );
}
