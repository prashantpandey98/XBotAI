import AiImage from '../assets/AiImage.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
  Edit,
} from '@mui/icons-material';

const drawerWidth = 280;

const Sidebar = ({ mobileOpen, handleDrawerToggle, onNewChat }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { actions } = useApp();

  const menuItems = [
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
      actions.clearCurrentConversation();
      navigate(item.path);
    }

    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        component='button'
        id='new-chat'
            onClick={() => {
            if (onNewChat) {
              onNewChat();
            }
            navigate('/');
          }}
        sx={{
          p: 2,
          pt: isMobile ? 10 : 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          border:'none',
          borderBottom: '1px solid #e0e0e0',
          background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
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
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (onNewChat) {
              onNewChat();
            }
            navigate('/');
          }}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <Typography variant="h6" noWrap component="div" mr={4}>
            New Chat
            </Typography>
          <Edit />
        </a>
      </Box>

      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 1 }}>
            {item.isButton ? (
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item);
                }}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  width: '100%'
                }}
                data-testid={item.text.toLowerCase().replace(' ', '-') + '-button'}
              >
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={item.icon}
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
              </a>
            ) : (
              <a
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  actions.clearCurrentConversation();
                  navigate(item.path);
                  if (isMobile) {
                    handleDrawerToggle();
                  }
                }}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  width: '100%'
                }}
                data-testid={item.text.toLowerCase().replace(' ', '-') + '-button'}
              >
                <ListItemButton
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
              </a>
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
    <>
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
    </>
  );
};

export default Sidebar;
