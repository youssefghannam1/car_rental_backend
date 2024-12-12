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
import CreateReservation from '../modals/CreateReservation';
import { TableNoData } from './table-no-data';
import { ReservationTableRow } from './reservation-table-row';
import { ReservationTableHead } from './reservation-table-head';
import { TableEmptyRows } from './table-empty-rows';
import { ReservationTableToolbar } from './reservation-table-toolbar';
import { emptyRows, applyFilter, getComparator, fetchDataReservations } from './utils';
import type { ReservationProps } from './reservation-table-row';

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState<'clientName' | 'carName' | 'startDate' | 'endDate' | 'price' | 'status' | 'action'>('clientName');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const validColumns: ('clientName' | 'carName' | 'startDate' | 'endDate' | 'price' | 'status' | 'action')[] = [
        'clientName',
        'carName',
        'startDate',
        'endDate',
        'price',
        'status',
        'action',
      ];

      if (validColumns.includes(id as 'clientName' | 'carName' | 'startDate' | 'endDate' | 'price' | 'status' | 'action')) {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id as 'clientName' | 'carName' | 'startDate' | 'endDate' | 'price' | 'status' | 'action');
      } else {
        console.warn('Invalid sort column:', id);
      }
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
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
      setPage(0);
    },
    []
  );

  return {
    page,
    orderBy,
    rowsPerPage,
    selected,
    order,
    onSort,
    onSelectAllRows,
    onSelectRow,
    onResetPage,
    onChangePage,
    onChangeRowsPerPage,
  };
}

export function ReservationView() {
  const table = useTable();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [filterName, setFilterName] = useState('');
  const [reservations, setReservations] = useState<ReservationProps[]>([]);

  useEffect(() => {
    const loadReservations = async () => {
      const storedReservations = localStorage.getItem('reservations');
      
      if (storedReservations) {
        try {
          setReservations(JSON.parse(storedReservations));
        } catch (e) {
          console.error('Failed to parse reservations from localStorage:', e);
        }
      } else {
        await fetchDataReservations(setReservations);
      }
    };
  
    loadReservations();
  }, []); 
  
  useEffect(() => {
    if (reservations.length > 0) {
      try {
        localStorage.setItem('reservations', JSON.stringify(reservations));
      } catch (e) {
        console.error('Failed to store reservations in localStorage:', e);
      }
    }
  }, [reservations]);

  const dataFiltered: ReservationProps[] = applyFilter({
    inputData: reservations,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const updateLocalStorage = async () => {
    try {
      await fetchDataReservations(setReservations);
      localStorage.setItem('reservations', JSON.stringify(reservations));
      console.log('LocalStorage updated with the latest reservations');
    } catch (e) {
      console.error('Failed to update reservations in localStorage:', e);
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Reservations
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleOpen}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Nouvelle Réservation
        </Button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CreateReservation setReservations={setReservations} setOpen={setOpen} open={open} />
        </LocalizationProvider>
      </Box>

      <Card>
        <ReservationTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />
        
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ReservationTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={reservations.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    reservations.map((reservation) => reservation.id)
                  )
                }
                headLabel={[  
                  { id: 'clientName', label: 'Client' },  
                  { id: 'carName', label: 'Modèle de voiture' },  
                  { id: 'startDate', label: 'Date de prise en charge' },  
                  { id: 'endDate', label: 'Date de retour' },  
                  { id: 'price', label: 'Prix total' },  
                  { id: 'status', label: 'Statut' },  
                  { id: 'action', label: 'Action' },  
                ]}                
              />
              <TableBody>
                {dataFiltered
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map((row) => (
                    <ReservationTableRow
                      key={row.id}
                      setReservations={setReservations}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}
                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, reservations.length)} />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={reservations.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
