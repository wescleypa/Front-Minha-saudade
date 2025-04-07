import * as React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton,
  Grid,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Button
} from '@mui/material';
import { useSession } from '../../../contexts/SessionContext';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import EditableField from '../../../components/Utils/EditableField';
import LabelIcon from '@mui/icons-material/Label';
import HelpIcon from '@mui/icons-material/Help';
import { estadosBrasil } from '../../../components/Utils/geral';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TvIcon from '@mui/icons-material/Tv';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LockIcon from '@mui/icons-material/Lock';

export default function ChatProfile({ selected }) {
  const { user } = useSession();
  
  // Estados para os selects
  const [state, setState] = React.useState(estadosBrasil.find(e => e.sigla === 'SP') || null);
  const [relation, setRelation] = React.useState('Avô/Avó');
  const [timeApart, setTimeApart] = React.useState('Anos');
  
  // Estados para os multiselects
  const [characteristics, setCharacteristics] = React.useState(['Sorriso marcante', 'Olhos claros']);
  const [clothingStyles, setClothingStyles] = React.useState(['Roupas tradicionais']);
  const [accessories, setAccessories] = React.useState(['Anel de ouro']);
  const [hobbies, setHobbies] = React.useState(['Tricô', 'Jardinagem']);
  const [tvShows, setTvShows] = React.useState(['Novela das 8']);

  // Dados de teste
  const chat = {
    id: 1,
    name: "Vovó Maria",
    avatar: "",
    created: "2023-05-15T14:30:00Z",
    biography: "Avó amorosa que adorava cozinhar",
    age: "78 anos",
    profession: "Aposentada (ex-professora)",
    definingWords: "Sábia, paciente e amorosa",
    values: "Família, educação e honestidade",
    specialMoment: "Nossos almoços de domingo",
    habits: "Sempre fazia bolinho de chuva",
    typicalFood: "Pão de mel e café",
    typicalPhrase: "Minha neta, a vida é feita de pequenos momentos",
    favoriteFood: "Bolo de laranja",
    favoriteMusic: "MPB dos anos 70",
    favoriteTV: "Novela das 8"
  };

  const stats = {
    totalMessages: 342,
    activeChats: 5,
    memories: 28,
    trainings: 15
  };

  // Funções de manipulação
  const handleStateChange = (_, newValue) => {
    setState(newValue);
    console.log('Estado selecionado:', newValue?.sigla);
  };

  const handleRelationChange = (event) => {
    setRelation(event.target.value);
    console.log('Relação alterada:', event.target.value);
  };

  const handleTimeApartChange = (event) => {
    setTimeApart(event.target.value);
    console.log('Tempo aparte alterado:', event.target.value);
  };

  const handleCharacteristicsChange = (_, newValue) => {
    setCharacteristics(newValue);
    console.log('Características atualizadas:', newValue);
  };

  const handleClothingStylesChange = (_, newValue) => {
    setClothingStyles(newValue);
    console.log('Estilos de roupa atualizados:', newValue);
  };

  const handleAccessoriesChange = (_, newValue) => {
    setAccessories(newValue);
    console.log('Acessórios atualizados:', newValue);
  };

  const handleHobbiesChange = (_, newValue) => {
    setHobbies(newValue);
    console.log('Hobbies atualizados:', newValue);
  };

  const handleTvShowsChange = (_, newValue) => {
    setTvShows(newValue);
    console.log('Programas de TV atualizados:', newValue);
  };

  // Opções para os selects
  const characteristicOptions = [
    'Sorriso marcante',
    'Olhos claros',
    'Cabelos grisalhos',
    'Voz suave',
    'Postura ereta'
  ];

  const clothingStyleOptions = [
    'Roupas tradicionais',
    'Vestidos florais',
    'Camisas sociais',
    'Chapéu característico',
    'Lenço no pescoço'
  ];

  const accessoryOptions = [
    'Anel de ouro',
    'Óculos redondos',
    'Relógio de bolso',
    'Brincos de pérola',
    'Lenço no bolso'
  ];

  const hobbyOptions = [
    'Tricô',
    'Jardinagem',
    'Leitura',
    'Culinária',
    'Pesca'
  ];

  const tvShowOptions = [
    'Novela das 8',
    'Jornal Nacional',
    'Programas de culinária',
    'Filmes clássicos',
    'Documentários'
  ];

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      pb: 10,
      pt: 10,
      bgcolor: 'background.default'
    }}>
      {/* Seção do perfil */}
      <Card sx={{ 
        mx: 2, 
        mt: 1, 
        boxShadow: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3
      }}>
        <CardContent sx={{ pt: 4 }}>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Avatar
              sx={{
                width: 76,
                height: 76,
                border: '3px solid',
                borderColor: 'grey',
                bgcolor: 'error.light'
              }}
              src={chat.avatar}
            >
              {chat.name.charAt(0)}
            </Avatar>

            <Box textAlign={'center'}>
              <Typography variant="h6" fontWeight={600}>
                {chat.name}
              </Typography>
              <Chip 
                size="small" 
                color="warning" 
                label="Inteligência média" 
                sx={{ mt: 1 }}
              />
            </Box>

            <IconButton sx={{ ml: 'auto' }}>
              <SettingsApplicationsIcon color="action" />
            </IconButton>
          </Stack>

          <Typography variant="body2" textAlign={'center'} sx={{ mt: 2 }}>
            Conversando desde {formatDate(chat.created)}
          </Typography>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Box sx={{ mx: 2, mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Estatísticas com {chat.name}
        </Typography>

        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            <Grid
              container
              spacing={2}
              sx={{
                display: 'flex',
                textAlign: 'center',
                justifyContent: 'center'
              }}
            >
              <Grid item>
                <Typography variant="body1" fontWeight={700}>
                  {stats.totalMessages}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mensagens
                </Typography>
              </Grid>

              <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <Divider orientation="vertical" flexItem sx={{ height: 30 }} />
              </Grid>

              <Grid item>
                <Typography variant="body1" fontWeight={700}>
                  {stats.memories}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Lembranças
                </Typography>
              </Grid>

              <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <Divider orientation="vertical" flexItem sx={{ height: 30 }} />
              </Grid>

              <Grid item>
                <Typography variant="body1" fontWeight={700}>
                  {stats.trainings}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Treinos
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Informações Básicas */}
      <Box sx={{ mx: 2, mt: 3 }}>
        <Tooltip title="Informações essenciais para personalizar as interações">
          <Typography sx={{ display: 'flex', alignItems: 'center' }} variant="subtitle2" color="text.secondary" gutterBottom>
            <LabelIcon sx={{ mr: 1, fontSize: 20 }} /> Informações básicas
          </Typography>
        </Tooltip>

        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            <EditableField 
              value={chat.name} 
              label="Nome" 
              helpText="Importante para entrar no personagem" 
            />
            <EditableField 
              value={chat.biography} 
              label="Biografia" 
              helpText="Compreensão sobre personalidade" 
            />
            <EditableField 
              value={chat.age} 
              label="Idade" 
              helpText="Vocabulário, gírias, personalidade" 
            />
            <EditableField 
              value={chat.profession} 
              label="Profissão" 
              helpText="Personalidade, assuntos, gostos" 
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Autocomplete
                options={estadosBrasil}
                getOptionLabel={(option) => `${option.nome} (${option.sigla})`}
                value={state}
                onChange={handleStateChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Estado de nascimento" 
                    placeholder="Digite para buscar..."
                  />
                )}
                renderOption={(props, option, index) => (
                  <Box key={index} component="li" {...props}>
                    {option.nome} ({option.sigla})
                  </Box>
                )}
              />
              <Typography variant="caption" color="text.secondary">
                Gírias, sotaques, vocabulário, contexto
              </Typography>
            </FormControl>
          </CardContent>
        </Card>
      </Box>

      {/* Relação */}
      <Box sx={{ mx: 2, mt: 3 }}>
        <Tooltip title="Detalhes sobre seu relacionamento">
          <Typography sx={{ display: 'flex', alignItems: 'center' }} variant="subtitle2" color="text.secondary" gutterBottom>
            <FavoriteIcon sx={{ mr: 1, fontSize: 20 }} /> Relação
          </Typography>
        </Tooltip>

        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Relação</InputLabel>
              <Select
                value={relation}
                onChange={handleRelationChange}
                label="Relação"
              >
                <MenuItem value="Pai/Mãe">Pai/Mãe</MenuItem>
                <MenuItem value="Avô/Avó">Avô/Avó</MenuItem>
                <MenuItem value="Amigo(a)">Amigo(a)</MenuItem>
                <MenuItem value="Amor">Amor</MenuItem>
                <MenuItem value="Pet">Pet</MenuItem>
              </Select>
              <Typography variant="caption" color="text.secondary">
                Vocabulário, contexto, assunto, gostos, apelidos
              </Typography>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Há quanto tempo não a(o) vê?</InputLabel>
              <Select
                value={timeApart}
                onChange={handleTimeApartChange}
                label="Há quanto tempo não a(o) vê?"
              >
                <MenuItem value="Dias">Dias</MenuItem>
                <MenuItem value="Meses">Meses</MenuItem>
                <MenuItem value="Anos">Anos</MenuItem>
              </Select>
              <Typography variant="caption" color="text.secondary">
                Contexto temporal das memórias
              </Typography>
            </FormControl>
          </CardContent>
        </Card>
      </Box>

      {/* Características e Personalidade */}
      <Box sx={{ mx: 2, mt: 3 }}>
        <Tooltip title="Traços físicos e de personalidade">
          <Typography sx={{ display: 'flex', alignItems: 'center' }} variant="subtitle2" color="text.secondary" gutterBottom>
            <PhotoCameraIcon sx={{ mr: 1, fontSize: 20 }} /> Características
          </Typography>
        </Tooltip>

        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Autocomplete
                multiple
                options={characteristicOptions}
                value={characteristics}
                onChange={handleCharacteristicsChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Características marcantes" 
                    placeholder="Sorriso, olhos, cabelo..."
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      size="small"
                      key={index}
                    />
                  ))
                }
              />
              <Typography variant="caption" color="text.secondary">
                Descrição física para personalização
              </Typography>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <Autocomplete
                multiple
                options={clothingStyleOptions}
                value={clothingStyles}
                onChange={handleClothingStylesChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Estilo de vestir" 
                    placeholder="Como costumava se vestir..."
                  />
                )}
              />
              <Typography variant="caption" color="text.secondary">
                Visual característico
              </Typography>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <Autocomplete
                multiple
                options={accessoryOptions}
                value={accessories}
                onChange={handleAccessoriesChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Acessórios característicos" 
                    placeholder="Anéis, óculos, relógios..."
                  />
                )}
              />
              <Typography variant="caption" color="text.secondary">
                Itens pessoais marcantes
              </Typography>
            </FormControl>

            <EditableField 
              value={chat.definingWords} 
              label="Defina em poucas palavras" 
              helpText="Adjetivos que melhor descrevem" 
            />
            <EditableField 
              value={chat.values} 
              label="Valores mais importantes" 
              helpText="Princípios e crenças" 
            />
          </CardContent>
        </Card>
      </Box>

      {/* Preferências e Interesses */}
      <Box sx={{ mx: 2, mt: 3 }}>
        <Tooltip title="Gostos e hobbies que definiam a pessoa">
          <Typography sx={{ display: 'flex', alignItems: 'center' }} variant="subtitle2" color="text.secondary" gutterBottom>
            <RestaurantIcon sx={{ mr: 1, fontSize: 20 }} /> Preferências
          </Typography>
        </Tooltip>

        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            <EditableField 
              value={chat.favoriteFood} 
              label="Comida favorita" 
              helpText="Pratos e receitas especiais" 
              icon={<RestaurantIcon color="primary" />}
            />
            
            <EditableField 
              value={chat.favoriteMusic} 
              label="Músicas/artistas favoritos" 
              helpText="Estilos musicais preferidos" 
              icon={<MusicNoteIcon color="primary" />}
            />
            
            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
              <Autocomplete
                multiple
                options={hobbyOptions}
                value={hobbies}
                onChange={handleHobbiesChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Hobbies e passatempos" 
                    placeholder="Atividades que gostava"
                  />
                )}
              />
              <Typography variant="caption" color="text.secondary">
                Como costumava passar o tempo
              </Typography>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <Autocomplete
                multiple
                options={tvShowOptions}
                value={tvShows}
                onChange={handleTvShowsChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Programas de TV/livros preferidos" 
                    placeholder="O que gostava de assistir/ler"
                  />
                )}
              />
              <Typography variant="caption" color="text.secondary">
                Preferências de entretenimento
              </Typography>
            </FormControl>
          </CardContent>
        </Card>
      </Box>

      {/* Memórias */}
      <Box sx={{ mx: 2, mt: 3 }}>
        <Tooltip title="Lembranças especiais compartilhadas">
          <Typography sx={{ display: 'flex', alignItems: 'center' }} variant="subtitle2" color="text.secondary" gutterBottom>
            <LabelIcon sx={{ mr: 1, fontSize: 20 }} /> Memórias
          </Typography>
        </Tooltip>

        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            <EditableField 
              value={chat.specialMoment} 
              label="Momento mais especial juntos" 
              helpText="Descreva com detalhes" 
              multiline
            />
            <EditableField 
              value={chat.habits} 
              label="O que sempre fazia quando você visitava?" 
              helpText="Rituais e costumes" 
              multiline
            />
            <EditableField 
              value={chat.typicalFood} 
              label="Comida/bebida que sempre oferecia" 
              helpText="Especialidades culinárias" 
            />
            <EditableField 
              value={chat.typicalPhrase} 
              label="Frase ou ditado que sempre repetia" 
              helpText="Expressões características" 
              multiline
            />
          </CardContent>
        </Card>
      </Box>

      {/* Botão de ação fixo */}
      <Box sx={{ px: 2, mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          fullWidth
          startIcon={<AddIcon />}
          sx={{
            py: 1.5,
            borderRadius: 3,
            boxShadow: 3
          }}
          disabled={true}
        >
          <LockIcon />&nbsp;Adicionar Nova Lembrança
        </Button>
      </Box>
    </Box>
  );
}

// Função auxiliar para formatar datas (mantida do código original)
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const messageDate = new Date(date.setHours(0, 0, 0, 0));
  const diffDays = Math.round((today - messageDate) / (1000 * 60 * 60 * 24));

  const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const timeStr = timeFormatter.format(new Date(dateString));

  if (diffDays === 0) {
    return timeStr;
  } else if (diffDays === 1) {
    return `Ontem às ${timeStr}`;
  } else if (diffDays === 2) {
    return `Anteontem às ${timeStr}`;
  } else {
    const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return dateFormatter.format(new Date(dateString))
      .replace(',', ' às')
      .replace(/(\d{2})\/(\d{2})/, '$1/$2');
  }
}