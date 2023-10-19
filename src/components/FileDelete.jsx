import { useState } from 'react';
import { deleteObject, ref } from 'firebase/storage';
import { useAtom } from 'jotai';
import PropTypes from 'prop-types';
import { userAtom } from '../utils/useAuth';
import { storage } from '../firebase';

FileDelete.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};

export default function FileDelete({ row, table }) {
  const [user] = useAtom(userAtom);
  const [deleting, setDeleting] = useState(false);
  const meta = table.options.meta;

  const deleteFile = async () => {
    setDeleting(true);
    try {
      const fileRef = ref(storage, `${user.uid}/${row.getValue('name')}`);

      await deleteObject(fileRef);
      meta?.removeRow(row.index);
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      console.log(error);
    }
  };

  return (
    <div className="delete">
      <button type="button" disabled={deleting} onClick={deleteFile}>
        {deleting ? 'Deleting' : 'Delete'}
      </button>
    </div>
  );
}
