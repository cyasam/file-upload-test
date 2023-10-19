import { getDownloadURL, getMetadata, listAll, ref } from 'firebase/storage';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAtom } from 'jotai';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { storage } from '../firebase';
import { userAtom } from '../utils/useAuth';
import FileDelete from './FileDelete';

import './FileList.css';

FileList.propTypes = {
  updated: PropTypes.bool,
};

const getFileSize = (size) => {
  if (size < 1024 ** 2) {
    return `${(size / 1024).toFixed(2)} KB`;
  }

  return `${(size / 1024 ** 2).toFixed(2)} MB`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
};

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>Name</span>,
  }),

  columnHelper.accessor((row) => row.size, {
    id: 'size',
    cell: (info) => <span>{getFileSize(info.getValue())}</span>,
    header: () => <span>Size</span>,
  }),

  columnHelper.accessor((row) => row.timeCreated, {
    id: 'timeCreated',
    cell: (info) => <span>{formatDate(info.getValue())}</span>,
    header: () => <span>Created</span>,
  }),

  columnHelper.accessor((row) => row.updated, {
    id: 'updated',
    cell: (info) => <span>{formatDate(info.getValue())}</span>,
    header: () => <span>Updated</span>,
  }),

  columnHelper.display({
    id: 'delete',
    cell: FileDelete,
  }),
];

export default function FileList({ updated }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [user] = useAtom(userAtom);

  const table = useReactTable({
    data: files,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      removeRow: (rowIndex) => {
        const setFilterFunc = (old) =>
          old.filter((_row, index) => index !== rowIndex);
        setFiles(setFilterFunc);
      },
    },
  });

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

  return (
    <div className="file-list-area">
      {loading && <div className="loading">Loading...</div>}
      {files && (
        <>
          {!loading && files.length === 0 && <div>No files</div>}
          {files.length > 0 && (
            <table className="file-list">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="row" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
