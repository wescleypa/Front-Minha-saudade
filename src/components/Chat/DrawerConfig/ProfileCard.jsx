import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Divider,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Button,
  Popover,
  TextField,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditableField from './EditableField';
import { Add, Close, Check } from '@mui/icons-material';
import { useSession } from '../../../contexts/SessionContext';
import { AddAPhoto } from '@mui/icons-material';

const ProfileCard = ({ camila, update }) => {
  const { user } = useSession();
  const [anchorEl, setAnchorEl] = React.useState();
  const [openNewChip, setOpenNewChip] = React.useState(false);
  const [valueAddChip, setvalueAddChip] = React.useState();

  const [chat, setChat] = React.useState({
    name: 'Nome não definido',
    role: 'Analista de transportes',
    avatar: '',
    bio: 'Especializada em conversas profundas e memórias afetivas.',
    extrals: []
  });

  React.useEffect(() => {
    if (user?.chats) {
      const chatEncontrado = user.chats.find(chat => chat.id === camila);

      if (chatEncontrado) {
        setChat(prev => {
          const updatedChat = {};

          Object.keys(prev).forEach(key => {
            updatedChat[key] = chatEncontrado[key] !== undefined && chatEncontrado[key] !== null && chatEncontrado[key] !== ''
              ? chatEncontrado[key]
              : prev[key];
          });

          return updatedChat;
        });
      }
    }
  }, [user, camila]);

  const handleRemoveSkill = async (index) => {
    // 1. Cria cópia do array atual (imutabilidade)
    const currentExtrals = [...(chat.extrals || [])];

    // 2. Guarda o valor ANTES de modificar (para rollback)
    const previousExtrals = [...currentExtrals];

    // 3. Remove o item (cria NOVO array)
    const newExtrals = currentExtrals.filter((_, i) => i !== index);

    // 4. Atualização OTIMISTA (UI primeiro)
    setChat(prev => ({ ...prev, extrals: newExtrals }));

    try {
      // 5. Chama a API (usando o valor NOVO)
      update(camila, 'extrals', newExtrals);

      //if (!success) {
      //  // Rollback se a API falhar
      //  setChat(prev => ({ ...prev, extrals: previousExtrals }));
      //  alert('Falha ao remover - alteração revertida');
      //}
    } catch (error) {
      console.error("Erro na remoção:", error);
      setChat(prev => ({ ...prev, extrals: previousExtrals }));
    }
  };

  const handleAddSkill = () => {
    if (valueAddChip) {
      const newExtrals = [...(chat.extrals || []), valueAddChip];

      setChat(prev => ({
        ...prev,
        extrals: newExtrals
      }));

      update(camila, 'extrals', newExtrals);
      setAnchorEl(null);
      setOpenNewChip(false);
      setvalueAddChip('');
    }
  };

  const handleOpenNewChip = (e) => {
    setAnchorEl(e?.currentTarget);
    setOpenNewChip(true);
  };

  const handleCloseNewChip = () => {
    setOpenNewChip(false);
    setAnchorEl(null);
  };

  const uploadPic = () => {
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

          setChat((prev) => ({ ...prev, avatar: result }));
          update(camila, 'avatar', result);
        };

        reader.onerror = (error) => console.error("Erro ao converter imagem:", error);
      }
    });

    document.body.appendChild(inputFile);
    inputFile.click();
    document.body.removeChild(inputFile);
  };
  
  return (
    <Card sx={{
      maxWidth: 345,
      borderRadius: 3,
      boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    }}>
      {/* Avatar */}
      <Box>
        <Avatar
          src={chat?.avatar}
          sx={{
            width: 80,
            height: 80,
            bottom: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            border: '3px solid white',
            boxShadow: 1
          }}
        >
          {!chat?.avatar && chat?.name.charAt(0)}
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
          onClick={() => uploadPic()}
        >
          <AddAPhoto fontSize="small" />
        </IconButton>
      </Box>

      {/* Conteúdo Principal */}
      <CardContent sx={{ mt: 5, textAlign: 'center' }}>
        <Tooltip title="A inteligência é calculada automaticamente baseando-se na porcentagem de informações fornecidas.">
          <Chip
            icon={<CheckCircleIcon fontSize="small" />}
            label="Inteligência mediana"
            color="warning"
            size="small"
            sx={{ mb: 1 }}
          />
        </Tooltip>

        {/* Nome e Cargo */}
        <EditableField
          value={chat?.name}
          onSave={(val) => update(camila, 'name', val)}
          sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}
        >
          <Typography variant="h6" color="text.secondary">
            {chat?.name}
          </Typography>
        </EditableField>

        <EditableField
          value={chat?.role}
          onSave={(val) => update(camila, 'role', val)}
          sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}
        >
          <Typography variant="body2" color="text.secondary">
            {chat?.role}
          </Typography>
        </EditableField>

        {/* Bio */}
        <EditableField
          value={chat?.bio}
          onSave={(val) => update(camila, 'bio', val)}
          sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}
        >
          <Typography variant="body2" color="text.secondary">
            {chat?.bio}
          </Typography>
        </EditableField>

        <Divider sx={{ my: 2 }} />

        {/* extrals (Chips) */}
        <Typography>Como era sua saudade ?</Typography>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
          <Popover
            open={openNewChip}
            anchorEl={anchorEl}
            onClose={() => handleCloseNewChip()}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <TextField
              variant="outlined"
              label="Nome"
              value={valueAddChip}
              onChange={(e) => setvalueAddChip(e?.target?.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleAddSkill} color="primary">
                        <Check fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={handleCloseNewChip}>
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
          </Popover>

          {chat?.extrals.map((trait, index) => (<>
            <Chip
              key={index}
              label={trait}
              variant="outlined"
              size={"small"}
              color="primary"
              onDelete={() => handleRemoveSkill(index)}
              deleteIcon={<Close />}
            />
          </>))}
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={(e) => handleOpenNewChip(e)}
            sx={{ borderRadius: 20 }}
          >
            Adicionar
          </Button>
        </Stack>
      </CardContent>

    </Card>
  );
};

export default ProfileCard;