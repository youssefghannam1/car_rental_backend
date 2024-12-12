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
import { InvoiceTableRow } from './invoices-table-row'; // Update to reflect Invoice Table Row
import { InvoiceTableHead } from './invoices-table-head'; // Update to reflect Invoice Table Head
import { TableEmptyRows } from './table-empty-rows';
import { InvoiceTableToolbar } from './invoices-table-toolbar'; // Update to reflect Invoice Table Toolbar
import { emptyRows, applyFilter, getComparator, fetchDataInvoices } from './utils';
import  CreateInvoiceModal  from '../modals/CreateInvoice'; 
import type { InvoiceProps } from './invoices-table-row'; // Update type to reflect invoices

// ----------------------------------------------------------------------

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState<'clientName' | 'invoiceNumber' | 'issueDate' | 'dueDate' | 'totalAmount' | 'status' | 'action'>('clientName');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const validColumns: ('clientName' | 'invoiceNumber' | 'issueDate' | 'dueDate' | 'totalAmount' | 'status' | 'action')[] = [
        'clientName',
        'invoiceNumber',
        'issueDate',
        'dueDate',
        'totalAmount',
        'status',
        'action',
      ];

      if (validColumns.includes(id as 'clientName' | 'invoiceNumber' | 'issueDate' | 'dueDate' | 'totalAmount' | 'status' | 'action')) {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id as 'clientName' | 'invoiceNumber' | 'issueDate' | 'dueDate' | 'totalAmount' | 'status' | 'action');
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

export function InvoiceView() {
  const [invoices, setInvoices] = useState<InvoiceProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  
  useEffect(() => {
    const loadInvoices = async () => {
      const storedInvoices = localStorage.getItem('invoices');
      if (storedInvoices) {
        setInvoices(JSON.parse(storedInvoices));
      } else 
        await fetchDataInvoices(setInvoices);
    };
    loadInvoices();
  }, []);

  const table = useTable();

  const dataFiltered: InvoiceProps[] = applyFilter({
    inputData: invoices,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const updateLocalStorage = async () => {
    try {
      await fetchDataInvoices(setInvoices);
      localStorage.setItem('invoices', JSON.stringify(invoices));
      console.log('LocalStorage updated with the latest invoices');
    } catch (e) {
      console.error('Failed to update invoices in localStorage:', e);
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Factures
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleOpen}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Nouveau Facture
        </Button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CreateInvoiceModal setInvoices={setInvoices} setOpen={setOpen} open={open} />
        </LocalizationProvider>
      </Box>

      <Card>
        <InvoiceTableToolbar
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
              <InvoiceTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={invoices.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    invoices.map((invoice) => invoice.id)
                  )
                }
                headLabel={[
                  { id: 'invoiceNumber', label: 'Invoice Number' },
                  { id: 'clientName', label: 'Client Name' },
                  { id: 'issueDate', label: 'Issue Date' },
                  { id: 'dueDate', label: 'Due Date' },
                  { id: 'totalAmount', label: 'Total Amount' },
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
                    <InvoiceTableRow
                      key={row.id}
                      setInvoices={setInvoices}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, invoices.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={invoices.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
