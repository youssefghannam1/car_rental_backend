import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
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
import ClientDetails from './modals/ClientDetails';
import { fetchDataClient, exportToPdf } from './utils';
import { fetchDataCars } from '../car/view/utils';
import EditModal from './modals/EditModal';
import ProlongationModal from './modals/ProlongationModal';



// ----------------------------------------------------------------------

export type CarProps = {
  id: string;
  model: string;
  brand: string;
  year: string;
  price_per_day: number;
  matricule: string;
  category: string;
  status: string;
  avatarUrl: string;
};

export type UserProps = {
  id: string;
  full_name: string;
  status: string;
  age: string;
  cars: Array<any>;
  reservations: Array<any>;
  date_debut: string;
  date_fin: string;
  days:number;
  total_price: number;
  telephone: string;
  cin: string;
  avatarUrl: string;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  setClients: (c: UserProps[]) => void,
  onSelectRow: () => void;
};

export function UserTableRow({ setClients, row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [editingClient, setEditingClient] = useState<UserProps>({
    id: "",
    full_name: "",
    status: "",
    age: "",
    cars: [
      {
      id: "",
      model: "",
      brand: "",
      year: "",
      total_price: 0,
      matricule: "",
      category: "",
      status: "",
      avatarUrl: "",
    }
  ],
    reservations: [],
    date_debut: "",
    date_fin: "",
    days: 0,
    total_price: 0,
    telephone: "",
    cin: "",
    avatarUrl: "",
  });
  const [editingProlongation, setEditingProlongation] = useState<any>({
    id: "",
    days: 0
  });
  const [open, setOpen] = useState<boolean>(false);
  const [cars, setCars] = useState<Array<any>>([]);
  const [openProlongation, setOpenProlongation] = useState<boolean>(false);
  const [openDisplayClient, setOpenDisplayClient] = useState<boolean>(false);
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);
  const handleProlongation = (client: UserProps) => {
    setOpenProlongation(true)
    setEditingProlongation({
      id :client?.id,
      days:client?.days
    })
  }

  useEffect(() => {
    const loadCars = async () => {
      const storedCars = localStorage.getItem("cars");
      if (storedCars) {
        setCars(JSON.parse(storedCars).filter((car: any) => car.status === "disponible"));
      } else {
        await fetchDataCars(setCars);
        setCars((prev) => prev.filter((car: any) => car.status === "disponible"));
      }
    };
    loadCars();
  }, []);

  const handleClient = (client: UserProps) => {
    setOpenDisplayClient(true);
  }

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDeletion = async (id: string) => {
    setOpenPopover(null);
    await axios.delete(`http://localhost:8000/api/clients/${id}`);
    await fetchDataClient(setClients);
    await fetchDataCars(setCars);
  }

  const handleEdit = (client: UserProps) => {
    setOpen(true)
    setEditingClient({
      id: client?.id,
      full_name: client?.full_name,
      status: client?.status,
      age: client?.age,
      cars: client?.cars,
      reservations: client?.reservations,
      date_debut: client?.date_debut,
      date_fin: client?.date_fin,
      total_price: client?.total_price,
      days: client?.days,
      telephone: client?.telephone,
      cin: client?.cin,
      avatarUrl: client?.avatarUrl
    })
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.full_name} src={row.avatarUrl} />
            {row.full_name}
          </Box>
        </TableCell>

        <TableCell>{row.age}</TableCell>

        <TableCell>{row.telephone}</TableCell>

        <TableCell>{row.cin}</TableCell>

        <TableCell>{row?.cars.map((car: any) => car.brand).join(', ')}</TableCell>

        <TableCell>{row.total_price}</TableCell>

        <TableCell>{row.days}</TableCell>

        <TableCell>
          <Label color={(row.status === 'en attente' && 'error') || 'success'}>{row.status}</Label>
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
          <MenuItem onClick={() => handleProlongation(row)}>
          <Iconify icon="material-symbols:schedule-outline" />
            Pronlongation
          </MenuItem>
          <ProlongationModal setClients={setClients} setEditingProlongation={setEditingProlongation} editingProlongation={editingProlongation} setOpen={setOpenProlongation} open={openProlongation} />
          <MenuItem onClick={() => handleClient(row)}>
          <Iconify icon="material-symbols:visibility" />
            Afficher
          </MenuItem>
          <ClientDetails client={row} open={openDisplayClient} setOpen={setOpenDisplayClient} />
          <MenuItem onClick={() => exportToPdf(row)}>
            <Iconify icon="material-symbols:print-outline" />
            Contrat
          </MenuItem>
          <MenuItem onClick={() => handleEdit(row)}>
            <Iconify icon="solar:pen-bold" />
            Modifier
          </MenuItem>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <EditModal setClients={setClients} setEditingClient={setEditingClient} editingClient={editingClient} setOpen={setOpen} open={open} />
          </LocalizationProvider>
          <MenuItem onClick={() => handleDeletion(row.id)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Supprimer
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}