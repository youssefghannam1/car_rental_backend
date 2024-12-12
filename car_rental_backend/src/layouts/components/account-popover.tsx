import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter, usePathname } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const pathname = usePathname();

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <IconButton onClick={handleOpenPopover}>
        <Avatar>{user.name ? user.name.charAt(0).toUpperCase() : 'A'}</Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user.name || 'User'}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email || 'No email'}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuList
  disablePadding
  sx={{
    p: 1,
    gap: 0.5,
    display: 'flex',
    flexDirection: 'column',
    [`& .${menuItemClasses.root}`]: {
      px: 1,
      gap: 2,
      borderRadius: 0.75,
      color: 'text.secondary',
      '&:hover': { color: 'text.primary' },
      [`&.${menuItemClasses.selected}`]: {
        color: 'text.primary',
        bgcolor: 'action.selected',
        fontWeight: 'fontWeightSemiBold',
      },
    },
  }}
>
  <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
  <MenuItem onClick={handleLogout}>Logout</MenuItem>
</MenuList>


      </Popover>
    </>
  );
}

