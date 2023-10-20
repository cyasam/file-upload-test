import { useEffect, useRef, useState } from 'react';
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
  const [percentages, setPercentages] = useState([]);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [user] = useAtom(userAtom);

  const uploadTaskRef = useRef([]);
  const disabled = status === 'uploading';

  const uploadFile = () => {
    if (acceptedFiles.length === 0) {
      return;
    }

    setStatus('uploading');

    acceptedFiles.forEach((file, index) => {
      const fileName = file.name;
      const storageRef = ref(storage, `${user.uid}/${fileName}`);
      const task = uploadBytesResumable(storageRef, file);

      let tasks = uploadTaskRef.current;
      tasks.push(task);

      setPercentages((prev) => {
        const clone = [...prev];
        clone[index] = { name: file.name, completed: false, value: 0 };
        return clone;
      });

      task.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setPercentages((prev) => {
            const clone = [...prev];
            clone[index] = { ...clone[index], value: Math.round(progress) };
            return clone;
          });
        },
        (error) => {
          setPercentages([]);

          if (error.code === 'storage/canceled') {
            setStatus('canceled');
          } else {
            setStatus('failed');
          }
        },
        () => {
          setPercentages((prev) => {
            const clone = [...prev];
            clone[index] = { ...clone[index], completed: true };
            return clone;
          });
        }
      );
    });
  };

  useEffect(() => {
    if (
      percentages.length > 0 &&
      percentages.every(({ completed }) => completed === true)
    ) {
      uploadTaskRef.current.length = 0;
      acceptedFiles.length = 0;
      setPercentages([]);
      setStatus('success');
    }
  }, [percentages, acceptedFiles]);

  const cancelUpload = () => {
    const uploadTask = uploadTaskRef.current;
    uploadTask.forEach((task) => {
      task.cancel();
    });
  };

  const pauseResumeUpload = () => {
    const uploadTask = uploadTaskRef.current;

    if (paused) {
      uploadTask.forEach((task) => {
        task.resume();
      });
      setPaused(false);
    } else {
      uploadTask.forEach((task) => {
        task.pause();
      });
      setPaused(true);
    }
  };

  return (
    <Layout>
      <div className="card">
        <div className="upload-area">
          <Status status={status} percentages={percentages} />
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
      <FileList updated={status === 'success' || status === 'canceled'} />
    </Layout>
  );
}
