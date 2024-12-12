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
import EditCar from '../modals/EditCar';
import CarDetails from '../modals/CarDetails';
import { fetchDataCars } from './utils';


// ----------------------------------------------------------------------

export type CarProps = {
  id: string;
  model: string;
  brand: string;
  year: string;
  location: string;
  mileage: string;
  transmission: string;
  fuel_level: string;
  color: string;
  price_per_day: number;
  matricule: string;
  category: string;
  status: string;
  avatarUrl: string;
};

type UserTableRowProps = {
  row: CarProps;
  selected: boolean;
  setCars: (c: CarProps[]) => void;
  onSelectRow: () => void;
};

export function UserTableRow({ setCars, row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [editingCar, setEditingCar] = useState<CarProps>({
    id: "",
    model: "",
    brand: "",
    year: "",
    price_per_day: 0,
    location: "",
    mileage: "",
    transmission: "",
    fuel_level: "",
    color: "",
    matricule: "",
    category: "",
    status: "",
    avatarUrl: "",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [openDisplayCar, setOpenDisplayCar] = useState<boolean>(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDeletion = async (id: string) => {
    setOpenPopover(null);
    await axios.delete(`http://localhost:8000/api/cars/${id}`);
    await fetchDataCars(setCars);
  };

  const handleCar = (car: CarProps) => {
    setOpenDisplayCar(true);
  };

  const handleEdit = (car: CarProps) => {
    setOpen(true);
    setEditingCar({
      id: car?.id,
      model: car?.model,
      brand: car?.brand,
      year: car?.year,
      location: car?.location,
      mileage: car?.mileage,
      transmission: car?.transmission,
      fuel_level: car?.fuel_level,
      color: car?.color,
      price_per_day: car?.price_per_day,
      matricule: car?.matricule,
      category: car?.category,
      status: car?.status,
      avatarUrl: car?.avatarUrl,
    });
  };

  const labelColor = (() => {
    switch (row.status.toLowerCase()) {
      case 'pas disponible':
        return 'error';
      case 'disponible':
        return 'success';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  })();

  console.log("Row status:", row.status, "Label color:", labelColor);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.model} src={row.avatarUrl} />
            {row.model}
          </Box>
        </TableCell>

        <TableCell>{row.brand}</TableCell>
        <TableCell>{row.year}</TableCell>
        <TableCell>{row.matricule}</TableCell>
        <TableCell>{row.category}</TableCell>
        <TableCell>{row?.price_per_day}</TableCell>

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
            Modifier
          </MenuItem>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <EditCar setCars={setCars} setEditingCar={setEditingCar} editingCar={editingCar} setOpen={setOpen} open={open} />
          </LocalizationProvider>
          <MenuItem onClick={() => handleCar(row)}>
            <Iconify icon="material-symbols:visibility" />
            Afficher
          </MenuItem>
          <CarDetails car={row} open={openDisplayCar} setOpen={setOpenDisplayCar} />
          <MenuItem onClick={() => handleDeletion(row.id)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
