import { useEffect, useState } from "react";
import { getUsers } from "../api/api";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface RowData {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  isAdmin: boolean;
}

export default function ManageUsers() {
  const [rows, setRows] = useState<RowData[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const res = await getUsers();
      switch (res) {
        case 403:
          nav('/');
          break;
        case 401:
          nav('signin');
          break;
        default:
          if (Array.isArray(res)) {
            const rowsWithId: RowData[] = res.map((row: any, index: number) => ({
              id: index + 1,
              firstName: row.firstName,
              lastName: row.lastName,
              address: row.address,
              email: row.email,
              isAdmin: row.role === 'admin',
            }));
            setRows(rowsWithId);
          } else {
            nav('signin');
          }
          break;
      }
    };
    checkAdminStatus();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 200,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 200,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 200,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 300,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'isAdmin',
      type: 'boolean',
      headerName: 'Is Admin',
      width: 100,
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: '80vw',
          height: '90vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
