import { useAtom } from 'jotai';
import Layout from '../components/Layout';
import { userAtom } from '../utils/useAuth';
import UpdatePasswordForm from '../components/forms/UpdatePasswordForm';
import UpdateUserProfileForm from '../components/forms/UpdateUserProfileForm';
import './UserSettings.css';

export default function UserSettings() {
  const [user] = useAtom(userAtom);

  const emailVerified = user.emailVerified;

  return (
    <Layout>
      <div className="settings-area">
        {!emailVerified && (
          <div className="error">
            Please verify email address. Check your inbox.{' '}
            <a href="/settings">Refresh</a>
          </div>
        )}

        <div className="column">
          <UpdateUserProfileForm />
        </div>

        <div className="column">
          <UpdatePasswordForm />
        </div>
      </div>
    </Layout>
  );
}
