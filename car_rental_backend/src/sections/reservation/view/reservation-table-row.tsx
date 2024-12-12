import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import axios from 'axios';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { UserProps } from 'src/sections/user/user-table-row';
import { fetchDataReservations } from './utils';
import EditReservation from '../modals/EditReservation';

export type ReservationProps = {
  id: string;
  client: UserProps;
  full_name: string;
  car_id: string;
  start_date: string;
  end_date: string;
  price: number;
  status: string;
};

type ReservationTableRowProps = {
  row: ReservationProps;
  selected: boolean;
  setReservations: (r: ReservationProps[]) => void;
  onSelectRow: () => void;
};

export function ReservationTableRow({
  setReservations,
  row,
  selected,
  onSelectRow,
}: ReservationTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [editingReservation, setEditingReservation] = useState<ReservationProps | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [carDetails, setCarDetails] = useState<{ brand: string; price_per_day: number } | null>(null);

  useEffect(() => {
    if (row.car_id) {
      axios
        .get(`http://localhost:8000/api/cars/${row.car_id}`)
        .then((response) => {
          console.log(response); // Check what the response looks like
          setCarDetails(response.data); // Update based on actual structure of the response
        })
        .catch((error) => {
          console.error('Error fetching car details:', error);
        });
    }
  }, [row.car_id]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDeletion = async (id: string) => {
    if (!id) {
      console.error('No ID provided for deletion');
      return;
    }

    console.log(`Attempting to delete reservation with ID: ${id}`);

    try {
      setOpenPopover(null);
      const response = await axios.delete(`http://localhost:8000/api/reservations/${id}`);
      console.log('Deletion successful:', response.data);
      await fetchDataReservations(setReservations);
      console.log('Reservations updated after deletion');
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  const handleEdit = (reservation: ReservationProps) => {
    setOpen(true);
    setEditingReservation({ ...reservation });
  };

  const rowPrice = row.price * 1;

  const labelColor =
    row.status.toLowerCase() === 'cancelled'
      ? 'error'
      : row.status.toLowerCase() === 'pending'
      ? 'warning'
      : 'success';

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.client.full_name} src="" />
            {row.client.full_name}
          </Box>
        </TableCell>

        <TableCell>
          {carDetails ? (
            <>
              {carDetails.brand} - ${carDetails?.price_per_day}
            </>
          ) : (
            'Loading...'
          )}
        </TableCell>

        <TableCell>{row.start_date}</TableCell>
        <TableCell>{row.end_date}</TableCell>
        <TableCell>{rowPrice.toFixed(2)}</TableCell>

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <EditReservation
              setReservations={setReservations}
              setEditingReservation={setEditingReservation}
              editingReservation={editingReservation}
              setOpen={setOpen}
              open={open}
            />
          </LocalizationProvider>
          <MenuItem
            onClick={() => handleDeletion(row.id)}
            sx={{ color: 'error.main' }}
            disabled={!row.id} // Disable button if row.id is undefined
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
