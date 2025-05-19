import { Box } from '@mui/material';
import Popover from '@mui/material/Popover';
import React from 'react';

interface TopbarPopoverProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function TopbarPopover({ title, icon, children }: TopbarPopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <Box>
      <div
        color="primary"
        onClick={(event) => {
          setAnchorEl(event.currentTarget as HTMLElement);
        }}
        title={title}
      >
        {icon}
      </div>

      <Popover
        anchorEl={anchorEl}
        open={open}
        id={open ? 'simple-popover' : undefined}
        onClose={() => {
          setAnchorEl(null);
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Box p={2}>
          <h4>{title}</h4>

          {children}
        </Box>
      </Popover>
    </Box>
  );
}
