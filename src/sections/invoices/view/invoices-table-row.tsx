import { useState, useCallback } from 'react';
import axios from "axios";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { fetchDataInvoices } from './utils'; 

// ----------------------------------------------------------------------

export type InvoiceProps = {
  id: string;
  client: {
    full_name : string;
    telephone	: number;
  }
  amount: number;
  date_issued: string;
  due_date: string;
  status: string;
  avatarUrl: string;
};

type InvoiceTableRowProps = {
  row: InvoiceProps;
  selected: boolean;
  setInvoices: (invoices: InvoiceProps[]) => void;
  onSelectRow: () => void;
};

export function InvoiceTableRow({ setInvoices, row, selected, onSelectRow }: InvoiceTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceProps>({
    id: "",
    client: { full_name: "" , telephone: 0 }, // Change clientName to match the structure
    amount: 0,
    date_issued: "",
    due_date: "",
    status: "",
    avatarUrl: "",
  });
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDeletion = async (id: string) => {
    setOpenPopover(null);
    await axios.delete(`http://localhost:8000/api/invoices/${id}`);
    await fetchDataInvoices(setInvoices);
  };

  const handleEdit = (invoice: InvoiceProps) => {
    setOpen(true);
    setEditingInvoice({
      id: invoice.id,
      client: invoice.client, // Adjusted field for client
      amount: invoice.amount,
      date_issued: invoice.date_issued,
      due_date: invoice.due_date,
      status: invoice.status,
      avatarUrl: invoice.avatarUrl,
    });
  };

  const labelColor =
    (row.status.toLowerCase() === 'unpaid' && 'error') ||
    (row.status.toLowerCase() === 'paid' && 'success') ||
    'warning'; // Custom logic for label colors

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.client.telephone}
          </Box>
        </TableCell>
        <TableCell>{row.client.full_name}</TableCell>

        <TableCell>{row.date_issued}</TableCell>

        <TableCell>{row.due_date}</TableCell>
        <TableCell>{row.amount}</TableCell>


        <TableCell>
          <Label color={labelColor}>{row.status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={() => handleEdit(row)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          
          <MenuItem onClick={() => handleDeletion(row.id)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
