import { useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import FileList from '../components/FileList';
import FileUpload from '../components/FileUpload';
import Status from '../components/Status';
import FileButtons from '../components/FileButtons';
import { userAtom } from '../utils/useAuth';
import Layout from '../components/Layout';
import './Home.css';

export default function Home() {
  const [status, setStatus] = useState('idle');
  const [paused, setPaused] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [user] = useAtom(userAtom);

  const uploadTaskRef = useRef();
  const disabled = status === 'uploading';

  const uploadFile = () => {
    if (acceptedFiles.length === 0) {
      return;
    }

    setStatus('uploading');

    const file = acceptedFiles[0];

    const fileName = file.name;
    const storageRef = ref(storage, `${user.uid}/${fileName}`);
    uploadTaskRef.current = uploadBytesResumable(storageRef, file);

    const uploadTask = uploadTaskRef.current;

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercentage(Math.round(progress));
      },
      (error) => {
        if (error.code === 'storage/canceled') {
          setStatus('canceled');
        } else {
          setStatus('failed');
        }
      },
      () => {
        acceptedFiles.length = 0;
        uploadTask.current = undefined;
        setStatus('success');
      }
    );
  };

  const cancelUpload = () => {
    const uploadTask = uploadTaskRef.current;
    uploadTask.cancel();
  };

  const pauseResumeUpload = () => {
    const uploadTask = uploadTaskRef.current;

    if (paused) {
      uploadTask.resume();
      setPaused(false);
    } else {
      uploadTask.pause();
      setPaused(true);
    }
  };

  return (
    <Layout>
      <div className="card">
        <Status status={status} percentage={percentage} />
        <div className="upload-area">
          <FileUpload
            disabled={disabled}
            onDrop={(files) => {
              setStatus('idle');
              setAcceptedFiles(files);
            }}
          />

          <FileButtons
            status={status}
            paused={paused}
            acceptedFiles={acceptedFiles}
            onStart={uploadFile}
            onPauseResume={pauseResumeUpload}
            onCancel={cancelUpload}
          />
        </div>
      </div>
      <FileList updated={status === 'success'} />
    </Layout>
  );
}
