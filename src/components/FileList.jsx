import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
} from 'firebase/storage';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAtom } from 'jotai';
import { storage } from '../firebase';
import { userAtom } from '../utils/useAuth';

FileList.propTypes = {
  updated: PropTypes.bool,
};

export default function FileList({ updated }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [user] = useAtom(userAtom);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);

      const listRef = ref(storage, user.uid);
      const res = await listAll(listRef);

      const filesMetaPromises = res.items.map((itemRef) => {
        return getMetadata(itemRef);
      });

      const filesDownloadPromises = res.items.map((itemRef) => {
        return getDownloadURL(itemRef);
      });

      const filesMetaResult = await Promise.allSettled(filesMetaPromises);
      const filesDownloadResult = await Promise.allSettled(
        filesDownloadPromises
      );

      const files = filesMetaResult.map((file, index) => {
        const obj = { ...file.value, url: filesDownloadResult[index].value };
        return obj;
      });

      setLoading(false);
      setFiles(files);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [user.uid]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    if (updated) {
      fetchFiles();
    }
  }, [updated, fetchFiles]);

  const getFileSize = (size) => {
    if (size < 1024 ** 2) {
      return `${(size / 1024).toFixed(2)} KB`;
    }

    return `${(size / 1024 ** 2).toFixed(2)} MB`;
  };

  const deleteFile = async (name) => {
    try {
      const fileRef = ref(storage, `${user.uid}/${name}`);

      await deleteObject(fileRef);
      fetchFiles();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Files</h2>
      {loading && <div>Loading...</div>}
      {files && (
        <>
          {!loading && files.length === 0 && <div>No files</div>}
          <ul className="list">
            {files?.map((file) => (
              <li key={file.generation}>
                <a target="_blank" rel="noreferrer" href={file.url}>
                  {file.name}
                </a>
                <span> - {getFileSize(file.size)}</span>
                <button type="button" onClick={() => deleteFile(file.name)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
