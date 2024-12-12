import { useState, useEffect, useCallback } from 'react';

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
import { TableNoData } from './table-no-data';
import { UserTableRow } from './car-table-row';
import { UserTableHead } from './car-table-head';
import { TableEmptyRows } from './table-empty-rows';
import { UserTableToolbar } from './car-table-toolbar';
import CreateCar from '../modals/CreateCar';
import { emptyRows, applyFilter, getComparator, fetchDataCars } from './utils';

import type { CarProps } from './car-table-row';

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

export function CarView() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  
  useEffect(() => {
    const loadCars = async () => {
      const storedCars = localStorage.getItem('cars');
      if (storedCars) {
        setCars(JSON.parse(storedCars));
      } else 
        await fetchDataCars(setCars);
    };
    loadCars();
  }, []);

  const table = useTable();

  const dataFiltered: CarProps[] = applyFilter({
    inputData: cars,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Voitures
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleOpen}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Nouveau Voiture
        </Button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CreateCar setCars={setCars} setOpen={setOpen} open={open} />
        </LocalizationProvider>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selectedRows.length}
          selectedItems={table.selectedRows}
          setSelectedItems={table.setSelectedRows}
          setCars={setCars}
          filterName={filterName}
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
                rowCount={cars.length}
                numSelected={table.selectedRows.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    cars.map((car) => car.id)
                  )
                }
                headLabel={[
                  { id: 'model', label: 'Model' },
                  { id: 'brand', label: 'Brand' },
                  { id: 'year', label: 'Year' },
                  { id: 'matricule', label: 'Matricule' },
                  { id: 'category', label: 'Category' },
                  { id: 'prix', label: 'Prix Par Jour' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Action' },
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
                      setCars={setCars}
                      row={row}
                      selected={table.selectedRows.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, cars.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={cars.length}
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

 