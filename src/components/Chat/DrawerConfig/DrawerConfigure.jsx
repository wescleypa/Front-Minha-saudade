import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  SwipeableDrawer,
  Tabs,
  Tab,
  Typography,
  IconButton,
  styled,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Grid,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FeatureBasic from './FeatureBasic';
import EditableField from './EditableField';
import ProfileCard from './ProfileCard';
import NoteApp from './Lembranças';
import { useSession } from '../../../contexts/SessionContext';

// Estilo personalizado para o drawer
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    height: '80%',
    maxHeight: '80%',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    overflow: 'visible', // Para a bolinha de puxar ficar visível
  },
}));

// Componente da bolinha de puxar
const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

// Componente de conteúdo das tabs
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function DrawerConfigure({ open, setOpen, camila, update }) {
  const { user } = useSession();

  const [chat, setChat] = useState({
    objetivo_conversa: '',
    estilo_comunicacao: '',
    sensibilidade: '',
    empatia: '',
    referencias_culturais: '',
    humor: '',
    nascimento: '',
    idade: '',
    relacao: '',
    aspecto: '',
    tempo_saudade: '',
    lembranca: '',
  });

  useEffect(() => {
    if (user?.chats) {
      const chatEncontrado = user.chats.find(chat => chat.id === camila);

      if (chatEncontrado) {
        setChat(prev => {
          const updatedChat = {};

          Object.keys(prev).forEach(key => {
            updatedChat[key] = chatEncontrado[key] !== undefined
              ? chatEncontrado[key]
              : prev[key];
          });

          return updatedChat;
        });
      }
    }
  }, [user, camila]);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const estadosBrasil = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
  ];

  return (
    <div>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={50}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            height: '80%',
            overflow: 'visible',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            bgcolor: '#EDF2F7'
          }
        }}
      >
        {/* Bolinha de puxar e botão de fechar */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Puller />
        </Box>
        <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Conteúdo do drawer */}
        <Box sx={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="Perfil" {...a11yProps(0)} />
              <Tab label="Lembranças" {...a11yProps(1)} />
              <Tab label="Aprimorar respostas" {...a11yProps(2)} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <FeatureBasic />

            <Box component="form" sx={{ p: 3 }}>
              <Grid container sx={{ gap: 4 }}>
                <Grid item size={{ sm: 3 }}>
                  <ProfileCard camila={camila} update={update} />
                </Grid>
                <Grid item padding={4} size={{ sm: 4 }}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 5
                  }}
                >
                  <Typography variant="h6" gutterBottom>Padrões</Typography>

                  <InputLabel>Você busca conversas para:</InputLabel>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel shrink={true}>Objetivo da conversa</InputLabel>
                    <Select value={chat?.objetivo_conversa} label="Objetivo da conversa" onChange={(e) => update(camila, 'objetivo_conversa', e?.target?.value)}>
                      <MenuItem value="Aliviar a saudade">Aliviar a saudade</MenuItem>
                      <MenuItem value="Relembrar momentos especiais">Relembrar momentos especiais</MenuItem>
                      <MenuItem value="Refletir sobre sentimentos">Refletir sobre sentimentos</MenuItem>
                      <MenuItem value="Criar novas memórias afetivas">Criar novas memórias afetivas</MenuItem>
                    </Select>
                  </FormControl>

                  <InputLabel>Como prefere que eu me comunique ?</InputLabel>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel shrink={true}>Comunicação</InputLabel>
                    <Select value={chat?.estilo_comunicacao} label="Comunicação" onChange={(e) => update(camila, 'estilo_comunicacao', e?.target?.value)}>
                      <MenuItem value="Poeticamente (metáforas, linguagem fluida)">🎭 Poeticamente (metáforas, linguagem fluida)</MenuItem>
                      <MenuItem value="Casualmente (como um amigo próximo)">💬 Casualmente (como um amigo próximo)</MenuItem>
                      <MenuItem value="Formalmente (estruturado e reflexivo)">📜 Formalmente (estruturado e reflexivo)</MenuItem>
                      <MenuItem value="Criativamente (com histórias ou imagens mentais)">🎨 Criativamente (com histórias ou imagens mentais)</MenuItem>
                    </Select>
                  </FormControl>

                  <InputLabel>Quando falarmos de saudade, você prefere:</InputLabel>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel shrink={true}>Sensibilidade</InputLabel>
                    <Select value={chat?.sensibilidade} label="Sensibilidade" onChange={(e) => update(camila, 'sensibilidade', e?.target?.value)}>
                      <MenuItem value="Foco no positivo (lembranças alegres)">😊 Foco no positivo (lembranças alegres)</MenuItem>
                      <MenuItem value="Permitir desabafos (aceitar tristeza)">😢 Permitir desabafos (aceitar tristeza)</MenuItem>
                      <MenuItem value="Abordagem neutra (equilíbrio emocional)">🧠 Abordagem neutra (equilíbrio emocional)</MenuItem>
                    </Select>
                  </FormControl>

                </Grid>

                <Grid item padding={4} size={{ sm: 4 }}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 5
                  }}
                >
                  <Typography variant="h6" gutterBottom>Traços de Personalidade</Typography>

                  <InputLabel>Nível de empatia</InputLabel>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel shrink={true}>Empatia</InputLabel>
                    <Select value={chat?.empatia} label="Empatia" onChange={(e) => update(camila, 'empatia', e?.target?.value)}>
                      <MenuItem value="Emocional (ex: 'Isso realmente parece ter sido marcante.')">💞 Emocional (ex: "Isso realmente parece ter sido marcante.")</MenuItem>
                      <MenuItem value="Delicada (ex: 'O que mais te toca nessa recordação?')">🤔 Delicada (ex: "O que mais te toca nessa recordação?")</MenuItem>
                      <MenuItem value="Sôlicita (ex: 'Será que hoje você vê isso de forma diferente?')">🌱 Sôlicita (ex: "Será que hoje você vê isso de forma diferente?")</MenuItem>
                    </Select>
                  </FormControl>

                  <InputLabel>Usar expressões ou referências específicas?</InputLabel>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel shrink={true}>Referências Culturais</InputLabel>
                    <Select value={chat?.referencias_culturais} label="Referências Culturais" onChange={(e) => update(camila, 'referencias_culturais', e?.target?.value)}>
                      <MenuItem value="Regionalismos (ex: 'Bão demais essa lembrança, né?')">📍 Regionalismos (ex: "Bão demais essa lembrança, né?")</MenuItem>
                      <MenuItem value="Músicas/poesias (ex: citar Vinicius de Moraes em respostas)">🎵 Músicas/poesias (ex: citar Vinicius de Moraes em respostas)</MenuItem>
                      <MenuItem value="Filmes/livros (ex: 'Lembra a cena de Central do Brasil...')">🎬 Filmes/livros (ex: "Lembra a cena de ‘Central do Brasil’...")</MenuItem>
                    </Select>
                  </FormControl>

                  <InputLabel>Definir humor</InputLabel>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel shrink={true}>Humor</InputLabel>
                    <Select value={chat?.humor} label="Humor" onChange={(e) => update(camila, 'humor', e?.target?.value)}>
                      <MenuItem value="Leve (ex: 'Essa história me deu um quentinho no coração!')">😊 Leve (ex: "Essa história me deu um quentinho no coração!")</MenuItem>
                      <MenuItem value="Neutra (ex: 'Entendo o valor desse momento para você.')">😇 Neutra (ex: "Entendo o valor desse momento para você.")</MenuItem>
                      <MenuItem value="Profunda (ex: 'Saudade é a dor que prova que o amor existiu.')">😢 Profunda (ex: "Saudade é a dor que prova que o amor existiu.")</MenuItem>
                    </Select>
                  </FormControl>

                </Grid>
              </Grid>

              <Grid container sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Grid item padding={4} size={{ sm: 11 }}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 5
                  }}
                >
                  <Typography variant="h6" textAlign={'center'} gutterBottom>Informações pessoais</Typography>
                  <Typography variant="body2" textAlign={'center'} sx={{ mb: 2 }} gutterBottom>
                    Essas informações são importantes para o aprimoramento pois ajuda a identificar sotaques,
                    Personalidade, formas de resposta, entre outros...
                  </Typography>

                  <Grid container size={12} gap={1}>
                    <Grid item size={{ sm: 3, xs: 12 }}>
                      <InputLabel shrink={true}>Estado de nascimento</InputLabel>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <Autocomplete
                          value={chat?.nascimento}
                          onChange={(e) => update(camila, 'nascimento', e?.target?.innerText)}
                          options={estadosBrasil}
                          getOptionLabel={(option) => `${option.nome} (${option.sigla})`}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Selecione um estado"
                              placeholder="Digite para buscar..."
                            />
                          )}
                          isOptionEqualToValue={(option, value) => option.sigla === value.sigla}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item size={{ sm: 4, xs: 12 }}>
                      <InputLabel>Qual a idade da sua saudade ?</InputLabel>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <TextField value={chat?.idade} onChange={(e) => setChat((prev) => ({ ...prev, idade: e?.target?.value }))} onBlur={(e) => update(camila, 'idade', e?.target?.value)}
                          type="number" label="Idade" variant="outlined" color="primary"
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item size={{ sm: 4, xs: 12 }}>
                      <InputLabel>Qual sua relação com a saudade ?</InputLabel>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel shrink={true}>Relação</InputLabel>
                        <Select value={chat?.relacao} label="Relação" onChange={(e) => update(camila, 'relacao', e?.target?.value)}>
                          <MenuItem value="Pai/mãe">Pai/mãe</MenuItem>
                          <MenuItem value="Avô/Avó">Avô/Avó</MenuItem>
                          <MenuItem value="Amigo(a)">Amigo(a)</MenuItem>
                          <MenuItem value="Amor">Amor</MenuItem>
                          <MenuItem value="Pet">Pet</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container size={12} gap={1}>

                    <Grid item size={{ sm: 4, xs: 12 }}>
                      <InputLabel>O que mais te tocava ?</InputLabel>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel shrink={true}>Aspecto mais importante para você</InputLabel>
                        <Select value={chat?.aspecto} label="Aspecto mais importante para você" onChange={(e) => update(camila, 'aspecto', e?.target?.value)}>
                          <MenuItem value="Físico (ex: sorriso, mãos)">Físico (ex: sorriso, mãos)</MenuItem>
                          <MenuItem value="Comportamento (ex: sempre cantava)">Comportamento (ex: sempre cantava)</MenuItem>
                          <MenuItem value="Frase típica (ex: 'Me conta seu dia')">Frase típica (ex: "Me conta seu dia")</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item size={{ sm: 3, xs: 12 }}>
                      <InputLabel>Há quanto tempo não a(e) vê?</InputLabel>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel shrink={true}>Tempo da saudade</InputLabel>
                        <Select value={chat?.tempo_saudade} label="Tempo da Saudade" onChange={(e) => update(camila, 'tempo_saudade', e?.target?.value)}>
                          <MenuItem value="Dias">Dias</MenuItem>
                          <MenuItem value="Meses">Meses</MenuItem>
                          <MenuItem value="Anos">Anos</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item size={{ sm: 4 }}>
                      <InputLabel>Algum lugar, música ou objeto que te lembra ela(e)?</InputLabel>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <TextField value={chat?.lembranca} onChange={(e) => setChat((prev) => ({ ...prev, lembranca: e?.target?.value }))} onBlur={(e) => update(camila, 'lembranca', e?.target?.value)}
                          type="text" label="Qual lembrança te toca mais ?" variant="outlined" color="primary" slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                        />
                      </FormControl>
                    </Grid>

                  </Grid>

                </Grid>
              </Grid>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <NoteApp camila={camila} update={update} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            Conteúdo da aba Histórico
          </TabPanel>
        </Box>
      </SwipeableDrawer >
    </div >
  );
}