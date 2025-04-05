import { IconButton } from '@mui/material';
import { Send, KeyboardVoice, Stop } from '@mui/icons-material';

const SubmitButton = ({ 
  isRecording, 
  hasAudio, 
  hasText, 
  onStartRecording 
}) => {
  const getButtonProps = () => {
    if (isRecording) {
      return {
        color: 'error',
        icon: <Stop />,
        label: "Parar gravação",
        bgColor: 'error.main',
        hoverColor: '#d32f2f'
      };
    }
    
    if (hasAudio || hasText) {
      return {
        color: 'primary',
        icon: <Send />,
        label: "Enviar mensagem",
        bgColor: 'primary.main',
        hoverColor: 'primary.dark'
      };
    }
    
    return {
      color: 'default',
      icon: <KeyboardVoice />,
      label: "Gravar áudio",
      bgColor: 'grey.500',
      hoverColor: 'grey.600'
    };
  };

  const { icon, label, bgColor, hoverColor } = getButtonProps();

  return (
    <IconButton
      type="submit"
      sx={{
        backgroundColor: bgColor,
        color: 'white',
        '&:hover': {
          backgroundColor: hoverColor
        },
        transition: 'background-color 0.3s ease'
      }}
      aria-label={label}
      onClick={!isRecording && !hasAudio && !hasText ? onStartRecording : undefined}
    >
      {icon}
    </IconButton>
  );
};

export default SubmitButton;