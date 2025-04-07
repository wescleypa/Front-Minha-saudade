import * as React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  ListItemIcon,
  Fab
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import EmailIcon from '@mui/icons-material/Email';
import HelpIcon from '@mui/icons-material/Help';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import QuickreplyIcon from '@mui/icons-material/Quickreply';

export default function HelpPage() {
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const faqItems = [
    {
      question: "Como alterar minha senha?",
      answer: "Acesse <b>Configurações</b> > <b>Segurança</b> e clique em <b>Alterar senha</b>. Depois é só seguir os passos que aparece."
    },
    {
      question: "Posso recuperar mensagens ou conversas excluídas?",
      answer: "<b>Depende!</b> Mensagens ou conversas excluídas permanecem na lixeira por <b>10 dias</b>, a menos que você solicite exclusão de sua conta.<br>Acesse <b>Configurações</b> > <b>Armazenamento</b> para recuperá-las."
    },
    {
      question: "Como ativar notificações ?",
      answer: "Vá para <b>Configurações</b> > <b>Notificações</b> e ajuste suas preferências para cada tipo de alerta."
    },
    {
      question: "Existe algum limite de utilização ?",
      answer: "<b>Sim!</b> No momento estamos em fase <b>beta</b>, e por isso existe algumas limitações de uso. Para saber mais consulte os <a href=''>termos</a> de uso."
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      <Typography variant="h6" sx={{ ml: 2, mt: 1, mb: 2 }}>
        Central de Ajuda
      </Typography>

      {/* Seção de FAQ */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <HelpIcon sx={{ mr: 1 }} /> Perguntas Frequentes
        </Typography>

        {faqItems.map((item, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary"><div dangerouslySetInnerHTML={{ __html: item?.answer }} /></Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Contatos de Suporte */}
      <Box sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SupportAgentIcon sx={{ mr: 1 }} /> Fale Conosco
        </Typography>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <ListItem>
            <ListItemIcon>
              <EmailIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="E-mail"
              secondary="minhasaudade@souwescley.com"
              slotProps={{
                secondary: {
                  color: 'primary.main'
                }
              }}
            />
          </ListItem>
          <Divider component="li" />

          <ListItem>
            <ListItemIcon>
              <WhatsAppIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="WhatsApp"
              secondary="(11) 91234-5678"
              slotProps={{
                secondary: {
                  color: 'primary.main'
                }
              }}
            />
          </ListItem>
          <Divider component="li" />

          <ListItem>
            <ListItemIcon>
              <ChatBubbleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Chat Online"
              secondary="Disponível 24h"
            />
            <Chip
              label="Abrir"
              color="primary"
              clickable
              onClick={() => console.log("Abrir chat")}
            />
          </ListItem>
        </List>
      </Box>

      {/* Botão Fixo de Atendimento */}
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 45,
          transform: 'translate(70%)'
        }}
      >
        <QuickreplyIcon sx={{ mr: 1 }} />
        Suporte rápido
      </Fab>
    </Box>
  );
}