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
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
  Icon
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Edit,
  CalendarToday,
  Link,
  Twitter,
  LinkedIn,
  GitHub,
  ArrowBack,
  Work,
  School,
  Person,
  Cake,
  Language,
  Close,
  Check,
  Add
} from '@mui/icons-material';
import { useSession } from '../../contexts/SessionContext';

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

const EditableListItem = ({ icon, primary, secondary, value, onSave }) => {
  return (
    <ListItem>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={
          <EditableField value={primary} onSave={(val) => onSave(val, 'primary')}>
            <Typography variant="body1">{primary}</Typography>
          </EditableField>
        }
        secondary={
          secondary && (
            <EditableField value={secondary} onSave={(val) => onSave(val, 'secondary')}>
              <Typography variant="body2" color="text.secondary">
                {secondary}
              </Typography>
            </EditableField>
          )
        }
      />
    </ListItem>
  );
};

function ProfilePage({ setPage }) {
  const { user, setUser } = useSession();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  // Dados do usuário com estado
  const [userData, setUserData] = useState({
    name: user?.name || "Camila Moura",
    title: user?.title || "Analista de Transportes PL",
    bio: user?.bio || "Apaixonada por trabalhar com transporte e sei lá o que eles fazem",
    email: user?.email || "camila@moura.com",
    phone: user?.phone || "(11) 98765-4321",
    location: user?.location || "São Paulo, Brasil",
    birthday: user?.birthday || "15/03/1999",
    twitter: user?.twitter || "@anasilva",
    linkedin: user?.linkedin || "linkedin.com/in/anasilva",
    github: user?.github || "github.com/anasilva",
    website: user?.website || "anasilva.dev",
    skills: ["React", "JavaScript", "CSS", "Material-UI", "Node.js"],
    education: [
      { degree: "Bacharel em Ciência da Computação", school: "Universidade XYZ", year: "2015-2019" }
    ],
    experience: [
      { position: "Desenvolvedora Front-end", company: "Tech Solutions", period: "2020-Presente" }
    ]
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddSkill = () => {
    setUserData({ ...userData, skills: [...userData.skills, 'Nova Habilidade'] });
  };

  const handleRemoveSkill = (index) => {
    const newSkills = [...userData.skills];
    newSkills.splice(index, 1);
    setUserData({ ...userData, skills: newSkills });
  };

  const handleUpdateSkill = (index, newValue) => {
    const newSkills = [...userData.skills];
    newSkills[index] = newValue;
    setUserData({ ...userData, skills: newSkills });
  };

  const handleAddEducation = () => {
    setUserData({
      ...userData,
      education: [...userData.education, { degree: '', school: '', year: '' }]
    });
  };

  const handleRemoveEducation = (index) => {
    const newEducation = [...userData.education];
    newEducation.splice(index, 1);
    setUserData({ ...userData, education: newEducation });
  };

  const handleUpdateEducation = (index, field, newValue) => {
    const newEducation = [...userData.education];
    newEducation[index][field] = newValue;
    setUserData({ ...userData, education: newEducation });
  };

  const handleAddExperience = () => {
    setUserData({
      ...userData,
      experience: [...userData.experience, { position: '', company: '', period: '' }]
    });
  };

  const handleRemoveExperience = (index) => {
    const newExperience = [...userData.experience];
    newExperience.splice(index, 1);
    setUserData({ ...userData, experience: newExperience });
  };

  const handleUpdateExperience = (index, field, newValue) => {
    const newExperience = [...userData.experience];
    newExperience[index][field] = newValue;
    setUserData({ ...userData, experience: newExperience });
  };

  return (
    <>
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

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Configurações</MenuItem>
            <MenuItem onClick={handleMenuClose}>Sair</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: isMobile ? 7 : 10, mb: 4, px: isMobile ? 1 : 4 }}>
        {/* Cabeçalho do perfil */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Banner/Capa */}
          <Box
            sx={{
              height: isMobile ? 120 : 200,
              backgroundColor: 'primary.main',
              position: 'relative'
            }}
          >
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
                  fontSize: isMobile ? 32 : 48
                }}
              >
                {userData.name.charAt(0)}
              </Avatar>
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
              >
                {isMobile ? <Edit /> : "Alterar senha"}
              </Button>
            </Box>

            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
              {userData.name}
            </Typography>

            <EditableField
              value={userData.title}
              onSave={(val) => setUserData({ ...userData, title: val })}
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                {userData.title}
              </Typography>
            </EditableField>

            {!isMobile && (
              <EditableField
                value={userData.bio}
                onSave={(val) => setUserData({ ...userData, bio: val })}
                multiline
              >
                <Typography paragraph>
                  {userData.bio}
                </Typography>
              </EditableField>
            )}

            {/* Chips de habilidades */}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }} useFlexGap flexWrap="wrap">
              {userData.skills.map((skill, index) => (
                <EditableField
                  key={index}
                  value={skill}
                  onSave={(val) => handleUpdateSkill(index, val)}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '16px',
                    px: 1,
                    py: 0.5,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Chip
                    label={skill}
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    onDelete={() => handleRemoveSkill(index)}
                    deleteIcon={<Close />}
                  />
                </EditableField>
              ))}
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                onClick={handleAddSkill}
                sx={{ borderRadius: 20 }}
              >
                Adicionar
              </Button>
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
              <Tab label="Experiência" />
              <Tab label="Educação" />
              <Tab label="Contato" />
            </Tabs>
          </Box>

          {/* Conteúdo das tabs */}
          <Box sx={{ p: isMobile ? 2 : 4 }}>
            {tabValue === 0 && (
              <Grid container spacing={isMobile ? 1 : 4}>
                <Grid item xs={12} md={6}>
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
                            {userData.email}
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
                            value={userData.phone}
                            onSave={(val) => setUserData({ ...userData, phone: val })}
                          >
                            <Typography variant="body1">
                              {userData.phone}
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
                            value={userData.location}
                            onSave={(val) => setUserData({ ...userData, location: val })}
                          >
                            <Typography variant="body1">
                              {userData.location}
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
                            value={userData.birthday}
                            onSave={(val) => setUserData({ ...userData, birthday: val })}
                          >
                            <Typography variant="body1">
                              {userData.birthday}
                            </Typography>
                          </EditableField>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
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
                            value={userData.twitter}
                            onSave={(val) => setUserData({ ...userData, twitter: val })}
                          >
                            <Typography variant="body1">
                              {userData.twitter}
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
                            value={userData.linkedin}
                            onSave={(val) => setUserData({ ...userData, linkedin: val })}
                          >
                            <Typography variant="body1">
                              {userData.linkedin}
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
                            value={userData.github}
                            onSave={(val) => setUserData({ ...userData, github: val })}
                          >
                            <Typography variant="body1">
                              {userData.github}
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
                            value={userData.website}
                            onSave={(val) => setUserData({ ...userData, website: val })}
                          >
                            <Typography variant="body1">
                              {userData.website}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Experiência Profissional
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddExperience}
                  >
                    Adicionar
                  </Button>
                </Box>

                {userData.experience.map((exp, index) => (
                  <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                    <IconButton
                      sx={{ position: 'absolute', top: 0, right: 0 }}
                      onClick={() => handleRemoveExperience(index)}
                    >
                      <Close />
                    </IconButton>

                    <Typography variant={isMobile ? "body1" : "subtitle1"} fontWeight="bold">
                      {exp.position}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.company}
                      {' • '}
                      {exp.period}
                    </Typography>
                    {!isMobile && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Descrição das responsabilidades e conquistas neste cargo.
                      </Typography>
                    )}
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Educação
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddEducation}
                  >
                    Adicionar
                  </Button>
                </Box>

                {userData.education.map((edu, index) => (
                  <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                    <IconButton
                      sx={{ position: 'absolute', top: 0, right: 0 }}
                      onClick={() => handleRemoveEducation(index)}
                    >
                      <Close />
                    </IconButton>

                    <Typography variant={isMobile ? "body1" : "subtitle1"} fontWeight="bold">
                      <EditableField
                        value={edu.degree}
                        onSave={(val) => handleUpdateEducation(index, 'degree', val)}
                      >
                        {edu.degree}
                      </EditableField>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <EditableField
                        value={edu.school}
                        onSave={(val) => handleUpdateEducation(index, 'school', val)}
                      >
                        {edu.school}
                      </EditableField>
                      {' • '}
                      <EditableField
                        value={edu.year}
                        onSave={(val) => handleUpdateEducation(index, 'year', val)}
                      >
                        {edu.year}
                      </EditableField>
                    </Typography>
                    {!isMobile && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Atividades extracurriculares, projetos relevantes.
                      </Typography>
                    )}
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Box>
            )}

            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Envie uma mensagem
                </Typography>
                <Box component="form" sx={{ maxWidth: 600 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Seu nome"
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Seu email"
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Assunto"
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Mensagem"
                        multiline
                        rows={isMobile ? 3 : 4}
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        size={isMobile ? "medium" : "large"}
                        sx={{ borderRadius: 2 }}
                      >
                        Enviar Mensagem
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default ProfilePage;