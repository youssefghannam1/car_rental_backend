import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CreateModal from '../modals/CreateModal';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, fetchDataClient, getComparator } from '../utils';
import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [filterName, setFilterName] = useState('');
  const [clients, setClients] = useState<UserProps[]>([]);

  useEffect(() => {
    const loadClients = async () => {
      const storedClients = localStorage.getItem('clients');
      if (storedClients) {
        setClients(JSON.parse(storedClients));
      } else {
        await fetchDataClient(setClients);
      }
    };
    loadClients();
  }, []);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: clients,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Clients
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleOpen}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Nouveau Client
        </Button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CreateModal setClients={setClients} setOpen={setOpen} open={open} />
        </LocalizationProvider>
      </Box>
      <Card>
        <UserTableToolbar
          numSelected={table.selectedRows.length}
          selectedItems={table.selectedRows}
          setSelectedItems={table.setSelectedRows}
          filterName={filterName}
          setClients={setClients}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={clients.length}
                numSelected={table.selectedRows.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    clients.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'full_name', label: 'Nom Complet' },
                  { id: 'age', label: 'Âge' },
                  { id: 'telephone', label: 'Téléphone' },
                  { id: 'cin', label: 'CIN' },
                  { id: 'car', label: 'Voiture' },
                  { id: 'prix', label: 'Prix Total' },
                  { id: 'days', label: 'Nombre de Jours' },
                  { id: 'status', label: 'Statut' },
                  { id: 'action', label: 'Action' }
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      setClients={setClients}
                      selected={table.selectedRows.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}
                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, clients.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={clients.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);  // Only track IDs for simplicity
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectRow = useCallback(
    (id: string) => {
      const newSelectedRows = selectedRows.includes(id)
        ? selectedRows.filter((selectedId) => selectedId !== id)
        : [...selectedRows, id];
      setSelectedRows(newSelectedRows);
    },
    [selectedRows]
  );
  
  const onSelectAllRows = useCallback(
    (checked: boolean, newRows: string[]) => {
      setSelectedRows(checked ? newRows : []);
    },
    []
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selectedRows,
    setSelectedRows,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
