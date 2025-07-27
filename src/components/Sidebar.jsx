import AiImage from '../assets/AiImage.png';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const Sidebar = ({ mobileOpen, handleDrawerToggle, onNewChat }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    {
      text: 'New Chat',
      icon: <AddIcon />,
      action: onNewChat,
      isButton: true,
    },
    {
      text: 'Past Conversations',
      icon: <HistoryIcon />,
      path: '/history',
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/analytics',
    },
  ];

  const handleNavigation = (item) => {
    if (item.isButton && item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }

    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src={AiImage}
            alt="Logo"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
            }}
          />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c88ff' }}>
          Bot AI
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 1 }}>
            {item.isButton ? (
              <Button
                fullWidth
                variant="contained"
                startIcon={item.icon}
                onClick={() => handleNavigation(item)}
                sx={{
                  justifyContent: 'flex-start',
                  background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {item.text}
              </Button>
            ) : (
              <ListItemButton
                onClick={() => handleNavigation(item)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(156, 136, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(156, 136, 255, 0.15)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(156, 136, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? '#9c88ff' : 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      color: location.pathname === item.path ? '#9c88ff' : 'inherit',
                    },
                  }}
                />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="caption" color="text.secondary" align="center">
          XBot AI v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid #e0e0e0',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
