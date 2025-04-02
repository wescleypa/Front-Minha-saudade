import React, { useState } from 'react';
import {
  Container,
  Box,
  Avatar,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tab,
  Tabs,
  TextField,
  Stack,
  useMediaQuery,
  Menu,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
  FormControl,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Popover
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Edit,
  Twitter,
  LinkedIn,
  GitHub,
  ArrowBack,
  Cake,
  Language,
  Close,
  Check,
  Add,
  AddAPhoto,
  AddPhotoAlternate
} from '@mui/icons-material';
import { useSession } from '../../contexts/SessionContext';
import { useSocket } from '../../contexts/SocketContext';

const EditableField = ({ value, onSave, children, multiline = false, sx = {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      {isEditing ? (
        <>
          <TextField
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            variant="outlined"
            size="small"
            multiline={multiline}
            rows={multiline ? 3 : 1}
            fullWidth
            autoFocus
            sx={{ mr: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleSave} color="primary">
                    <Check fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleCancel}>
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </>
      ) : (
        <>
          {children || (
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {value}
            </Typography>
          )}
          <IconButton size="small" onClick={handleEdit} sx={{ ml: 1 }}>
            <Edit fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
};

function ProfilePage({ setPage }) {
  const { user, setUser } = useSession();
  const { socket } = useSocket();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElPW, setAnchorElPW] = useState(null);
  const [error, setError] = useState();
  const [openAddSKill, setOpenAddSKill] = useState();
  const [addSKill, setAddSkill] = useState();
  const [openChangePW, setOpenChangePW] = useState();
  const [loading, setLoading] = useState(false);
  const [actualPass, setActualPass] = useState();
  const [newPass, setNewPass] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [errors, setErrors] = useState({
    pass: null,
    newpass: null
  });
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePW = () => {
    setAnchorElPW(null);
    setOpenChangePW();
  };

  const handleOpenSkill = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenAddSKill(true);
  };

  const handleOpenChangePW = (event) => {
    setAnchorElPW(event.currentTarget);
    setOpenChangePW(true);
  };

  const handleAddSkill = async () => {
    if (!addSKill?.trim()) return; // Não adiciona valores vazios
  
    // Garante que skills seja um array
    const currentSkills = Array.isArray(user?.skills) ? user.skills : [];
    const newSkill = addSKill.trim();
  
    // Atualização OTIMISTA (UI primeiro)
    setUser(prev => ({
      ...prev,
      skills: [...currentSkills, newSkill]
    }));
  
    // Fecha o modal e limpa o input
    setOpenAddSKill(false);
    setAddSkill('');
  
    try {
      // Envia para o servidor
      await new Promise((resolve, reject) => {
        socket.emit('updateprofile', 
          { 
            token: user?.token, 
            input: 'addSkill', 
            value: newSkill 
          }, 
          (response) => {
            if (response?.status !== 'success') {
              reject(response?.error || 'Falha ao adicionar habilidade');
            } else {
              resolve();
            }
          }
        );
      });
    } catch (error) {
      // ROLLBACK em caso de erro
      setUser(prev => ({
        ...prev,
        skills: currentSkills // Volta para o array original
      }));
      
      console.error('Falha ao salvar:', error);
      setError(typeof error === 'string' ? error : 'Falha ao atualizar, tente novamente.');
      setAddSkill(addSKill); // Restaura o valor
      setOpenAddSKill(true); // Reabre o modal
    }
  };

  const handleRemoveSkill = async (index) => {
    // Garante que skills seja um array válido
    const currentSkills = Array.isArray(user?.skills) ? [...user.skills] : [];

    // Verifica se o índice existe
    if (index < 0 || index >= currentSkills.length) return;

    // Guarda o item removido para possível rollback
    const removedItem = currentSkills[index];

    // Remove o item (cria novo array)
    const newSkills = currentSkills.filter((_, i) => i !== index);

    // Atualização otimista
    setUser(prev => ({
      ...prev,
      skills: newSkills
    }));

    // Envia para o servidor
    await socket.emit('updateprofile',
      {
        token: user?.token,
        input: 'removeSkill',
        value: removedItem // Usa o item guardado
      },
      (response) => {
        if (response?.status !== 'success') {
          console.error('Falha ao remover skill:', response?.error);
          // Rollback em caso de erro
          setUser(prev => ({
            ...prev,
            skills: [...(prev.skills || []), removedItem]
          }));
          setError(response?.error || 'Falha ao atualizar, tente novamente.');
        }
      }
    );
  };

  const updateUser = async (input, value) => {
    const backup = value;
    setUser((prev) => ({ ...prev, [input]: value }));
    if (input && value) {
      await socket.emit('updateprofile', { token: user?.token, input, value }, (response) => {
        if (response.status === 'success') {
          setUser((prev) => ({ ...prev, [input]: value }));
        } else {
          console.error('Falha ao salvar atualização', response.error);
          setUser((prev) => ({ ...prev, [input]: backup }));
          setError(response?.error ?? 'Falha ao atualizar, tente novamente ou refaça login.');
        }
      });
    }
  };

  const handleSwitch = async (campo) => {
    var value = '';

    if (campo === 'nPlataforma') value = user?.nPlataforma;
    if (campo === 'nEmail') value = user?.nEmail;
    if (campo === 'mCrud') value = user?.mCrud;
    const backup = value;

    setUser((prev) => ({ ...prev, [campo]: !prev[campo] }));
    await socket.emit('updateprofile', { token: user?.token, input: campo, value: !value }, (response) => {
      if (response.status !== 'success' || !response.status) {
        console.error('Falha ao salvar atualização', response.error);
        setUser((prev) => ({ ...prev, [campo]: !prev[campo] }));
        setError(response?.error ?? 'Falha ao atualizar, tente novamente ou refaça login.');
      }
    });
  };

  const handleCloseAlert = () => setError();

  const handleCloseSkill = () => {
    setAnchorEl(null);
    setOpenAddSKill(false);
  }

  const uploadPic = async (type) => {
    const backup = user[type];
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml";
    inputFile.style.display = "none";

    inputFile.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
          const { result } = reader;

          setUser((prev) => ({ ...prev, [type]: result }));
          await socket.emit('updateprofile', { token: user?.token, input: type, value: result }, (response) => {
            if (response?.status !== 'success' || !response?.status) {
              console.error('Falha ao salvar atualização', response.error);
              setUser((prev) => ({ ...prev, [type]: backup }));
              alert('erro');
            }
          });
        };

        reader.onerror = (error) => console.error("Erro ao converter imagem:", error);
      }
    });

    document.body.appendChild(inputFile);
    inputFile.click();
    document.body.removeChild(inputFile);
  };

  const handleChangePW = async () => {
    if (!actualPass) {
      return setErrors((prev) => ({ ...prev, pass: 'Digite a senha atual.' }));
    } else setErrors((prev) => ({ ...prev, pass: null }));
    if (!newPass) {
      return setErrors((prev) => ({ ...prev, newpass: 'Digite a nova senha.' }));
    } else setErrors((prev) => ({ ...prev, newpass: null }));
    if (!confirmPass) {
      return setErrors((prev) => ({ ...prev, newpass: 'Confirme a nova senha.' }));
    } else setErrors((prev) => ({ ...prev, newpass: null }));

    if (newPass !== confirmPass) {
      return setErrors((prev) => ({ ...prev, newpass: 'Senha e confirmação não confere.' }));
    } else setErrors((prev) => ({ ...prev, newpass: null }));

    setLoading(true);
    await socket.emit('changepw', { token: user?.token, pass: newPass, actual: actualPass }, (response) => {
      if (response?.status === 'success') {
      } else {
        setError(response?.error ?? 'Falha ao atualizar senha, faça login novamente.');
      }
      setLoading(false);
      setAnchorElPW(null);
      setOpenChangePW();
      setActualPass();
      setConfirmPass();
      setNewPass();
    });
  };

  return (
    <>
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* AppBar fixo */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          {isMobile ? (
            <IconButton edge="start" color="inherit" aria-label="voltar" onClick={() => setPage('chat')}>
              <ArrowBack />
            </IconButton>
          ) : (
            <>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => setPage('chat')}>
                Minha Saudade
              </Typography>

              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setPage('chat')}
              >
                <ArrowBack />&nbsp;Voltar para Chat
              </Typography>
            </>
          )}

          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 10, mb: 4, px: isMobile ? 1 : 4 }}>
        {/* Cabeçalho do perfil */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Banner/Capa */}
          <Box
            sx={{
              height: isMobile ? 120 : 200,
              backgroundColor: user?.banner ? '' : 'primary.main',
              position: 'relative',
              background: user?.banner ? `url(${user?.banner})` : '',
              backgroundSize: 'contain'
            }}
          >

            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
              aria-label="Alterar banner"
              onClick={() => uploadPic('banner')}
            >
              <AddPhotoAlternate fontSize="small" />
            </IconButton>

            <Box sx={{
              position: 'absolute',
              bottom: isMobile ? -40 : -64,
              left: isMobile ? 16 : 32,
              border: '4px solid white',
              borderRadius: '50%',
              backgroundColor: 'white'
            }}>
              <Avatar
                sx={{
                  width: isMobile ? 80 : 128,
                  height: isMobile ? 80 : 128,
                  fontSize: isMobile ? 32 : 48,
                }}
              >
                {user?.pic ? (<img src={user?.pic} />) : user?.name?.charAt(0)}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
                aria-label="Alterar foto"
                onClick={() => uploadPic('pic')}
              >
                <AddAPhoto fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Informações básicas */}
          <Box sx={{
            pt: isMobile ? 6 : 8,
            pl: isMobile ? 20 : 32,
            pr: isMobile ? 2 : 4,
            pb: isMobile ? 2 : 3,
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              top: isMobile ? 8 : 16,
              right: isMobile ? 8 : 16
            }}>
              <Button
                variant="contained"
                startIcon={!isMobile && <Edit />}
                size={isMobile ? "small" : "medium"}
                sx={{ borderRadius: 20 }}
                onClick={handleOpenChangePW}
              >
                {isMobile ? <Edit /> : "Alterar senha"}
              </Button>

              <Popover
                id="changePassword"
                open={!!openChangePW}
                anchorEl={anchorElPW}
                onClose={handleClosePW}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                {/* Seta equivalente ao PopoverArrow */}
                <Box sx={{
                  position: 'absolute',
                  top: -10,
                  left: 'calc(50% - 10px)',
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderBottom: '10px solid white',
                  filter: 'drop-shadow(0px -2px 2px rgba(0,0,0,0.1))'
                }} />

                {/* Header com botão de fechar */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  pb: 1
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Alterar senha
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleCloseSkill}
                    sx={{ ml: 2 }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>

                <Divider />

                {/* Corpo do Popover */}
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <TextField
                    variant="outlined"
                    label="Senha atual"
                    size="small"
                    value={actualPass}
                    onChange={(e) => setActualPass(e?.target?.value)}
                    disabled={loading}
                    error={!!errors?.pass}
                    helperText={<Typography variant="body2">{errors?.pass}</Typography>}
                  />
                  <br />
                  <TextField
                    variant="outlined"
                    label="Nova senha"
                    size="small"
                    value={newPass}
                    onChange={(e) => setNewPass(e?.target?.value)}
                    disabled={loading}
                    error={!!errors?.newpass}
                    helperText={<Typography variant="body2">{errors?.newpass}</Typography>}
                  />
                  <TextField
                    variant="outlined"
                    label="Confirme a nova senha"
                    size="small"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e?.target?.value)}
                    disabled={loading}
                    error={!!errors?.newpass}
                    helperText={<Typography variant="body2">{errors?.newpass}</Typography>}
                  />
                  <br />

                  <Button disabled={loading} variant="outlined" sx={{ mt: 2 }} onClick={() => handleChangePW()}>
                    Atualizar
                  </Button>
                </Box>
              </Popover>
            </Box>

            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
              {user?.name}
            </Typography>

            <EditableField
              value={user?.title ?? ''}
              onSave={(val) => updateUser('title', val)}
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                {user?.title ?? 'Um título qualquer...'}
              </Typography>
            </EditableField>

            {!isMobile && (
              <EditableField
                value={user?.bio}
                onSave={(val) => updateUser('bio', val)}
                multiline
              >
                <Typography paragraph>
                  {user?.bio ?? 'Era uma vez, uma biografia...'}
                </Typography>
              </EditableField>
            )}

            {/* Chips de habilidades */}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }} useFlexGap flexWrap="wrap">
              {user?.skills && Array.isArray(user?.skills) ? (
                user?.skills?.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    onDelete={() => handleRemoveSkill(index)}
                    deleteIcon={<Close />}
                  />
                ))
              ) : (
                ['Informação', 'Extra'].map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    onDelete={() => handleRemoveSkill(index)}
                    deleteIcon={<Close />}
                  />
                ))
              )}

              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                onClick={handleOpenSkill}
                sx={{ borderRadius: 20 }}
              >
                Adicionar
              </Button>

              <Popover
                id="addSKill"
                open={!!openAddSKill}
                anchorEl={anchorEl}
                onClose={handleCloseSkill}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                {/* Seta equivalente ao PopoverArrow */}
                <Box sx={{
                  position: 'absolute',
                  top: -10,
                  left: 'calc(50% - 10px)',
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderBottom: '10px solid white',
                  filter: 'drop-shadow(0px -2px 2px rgba(0,0,0,0.1))'
                }} />

                {/* Header com botão de fechar */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  pb: 1
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Adicionar
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleCloseSkill}
                    sx={{ ml: 2 }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>

                <Divider />

                {/* Corpo do Popover */}
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2">
                    Adicionar informação extra
                  </Typography>
                  <br />

                  <TextField
                    variant="outlined"
                    label="Descrição"
                    size="small"
                    value={addSKill}
                    onChange={(e) => setAddSkill(e?.target?.value)}
                  />
                  <br />

                  <Button variant="outlined" sx={{ mt: 2 }} onClick={() => handleAddSkill()}>
                    Adicionar
                  </Button>
                </Box>
              </Popover>
            </Stack>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Sobre" />
              <Tab label="Configurações" />
            </Tabs>
          </Box>

          {/* Conteúdo das tabs */}
          <Box sx={{ p: isMobile ? 2 : 4 }}>
            {tabValue === 0 && (
              <Grid container spacing={isMobile ? 1 : 4}>
                <Grid item size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Informações Pessoais
                  </Typography>
                  <List dense={isMobile}>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: isMobile ? 36 : 56 }}>
                        <Email fontSize={isMobile ? "small" : "medium"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            {user?.email}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: isMobile ? 36 : 56 }}>
                        <Phone fontSize={isMobile ? "small" : "medium"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <EditableField
                            value={user?.phone}
                            onSave={(val) => updateUser('phone', val)}
                          >
                            <Typography variant="body1">
                              {user?.phone ?? 'Seu telefone'}
                            </Typography>
                          </EditableField>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: isMobile ? 36 : 56 }}>
                        <LocationOn fontSize={isMobile ? "small" : "medium"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <EditableField
                            value={user?.location}
                            onSave={(val) => updateUser('location', val)}
                          >
                            <Typography variant="body1">
                              {user?.location ?? 'São Paulo, Brasil'}
                            </Typography>
                          </EditableField>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: isMobile ? 36 : 56 }}>
                        <Cake fontSize={isMobile ? "small" : "medium"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <EditableField
                            value={user?.birthday}
                            onSave={(val) => updateUser('birthday', val)}
                          >
                            <Typography variant="body1">
                              {user?.birthday ?? 'Data de nascimento'}
                            </Typography>
                          </EditableField>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Redes Sociais
                  </Typography>
                  <List dense={isMobile}>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: isMobile ? 36 : 56 }}>
                        <Twitter fontSize={isMobile ? "small" : "medium"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <EditableField
                            value={user?.twitter}
                            onSave={(val) => updateUser('twitter', val)}
                          >
                            <Typography variant="body1">
                              {user?.twitter ?? 'Perfil no X'}
                            </Typography>
                          </EditableField>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: isMobile ? 36 : 56 }}>
                        <LinkedIn fontSize={isMobile ? "small" : "medium"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <EditableField
                            value={user?.linkedin}
                            onSave={(val) => updateUser('linkedin', val)}
                          >
                            <Typography variant="body1">
                              {user?.linkedin ?? 'Perfil LinkedIn'}
                            </Typography>
                          </EditableField>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: isMobile ? 36 : 56 }}>
                        <GitHub fontSize={isMobile ? "small" : "medium"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <EditableField
                            value={user?.github}
                            onSave={(val) => updateUser('github', val)}
                          >
                            <Typography variant="body1">
                              {user?.github ?? 'Perfil github'}
                            </Typography>
                          </EditableField>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: isMobile ? 36 : 56 }}>
                        <Language fontSize={isMobile ? "small" : "medium"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <EditableField
                            value={user?.website}
                            onSave={(val) => updateUser('website', val)}
                          >
                            <Typography variant="body1">
                              {user?.website ?? 'Seu site'}
                            </Typography>
                          </EditableField>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <Box>
                <FormControl
                  component="fieldset"
                  sx={{
                    display: 'flex',
                    alignItems: 'left'
                  }}
                >
                  <Typography fontWeight={700}>
                    Notificações
                  </Typography>
                  <FormControlLabel
                    control={<Switch />}
                    label="Novas mensagens pela plataforma"
                    labelPlacement="end"
                    sx={{ marginLeft: 0 }}
                    checked={user?.nPlataforma}
                    onChange={() => handleSwitch('nPlataforma')}
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Novas mensagens por E-mail"
                    labelPlacement="end"
                    sx={{ marginLeft: 0 }}
                    checked={user?.nEmail}
                    onChange={() => handleSwitch('nEmail')}
                  />
                  <br />
                  <Typography fontWeight={700}>
                    Mensagens
                  </Typography>
                  <FormControlLabel
                    control={<Switch />}
                    label="Mensagens após conversa finalizada"
                    labelPlacement="end"
                    sx={{ marginLeft: 0 }}
                    checked={user?.mCrud}
                    onChange={() => handleSwitch('mCrud')}
                  />

                </FormControl>

              </Box>
            )}

          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default ProfilePage;