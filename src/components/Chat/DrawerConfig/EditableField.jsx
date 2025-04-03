import { useEffect, useState } from "react";
import { Box, TextField, InputAdornment, IconButton, Typography } from "@mui/material";
import { Edit, Close, Check, Label } from "@mui/icons-material";

export default function EditableField({ value, onSave, children, multiline = false, sx = {}, label = '' }) {
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

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      {isEditing ? (
        <>
          <TextField
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            variant="outlined"
            size="small"
            label={label}
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
          <>
            {label && (
              <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
            )}
            {children || (
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {value}
              </Typography>
            )}
          </>

          <IconButton size="small" onClick={handleEdit} sx={{ ml: 1, mt: label ? 2 : 0 }}>
            <Edit fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
};