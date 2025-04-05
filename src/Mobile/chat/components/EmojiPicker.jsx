import { Popover, Tab, Tabs, Box, IconButton } from '@mui/material';
import { InsertEmoticon } from '@mui/icons-material';
import React, { useState, useMemo, useCallback } from 'react';

const EMOJI_CATEGORIES = [
  {
    emoji: "😅", content: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "🫠", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "☺️", "😚",
      "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🫢", "🫣", "🤔", "🤫", "🫡", "🤐", "🤨", "😐", "😑", "😶", "🫥",
      "😶‍🌫️", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "🫨", "🙂‍↔️", "🙂‍↕️", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢",
      "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "😵‍💫", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "🫤", "😟", "🙁", "☹️", "😮", "😯",
      "😲", "😳", "🥺", "🥹", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡",
      "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀",
      "😿", "😾", "🙈", "🙉", "🙊", "💋", "💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💤", "👋", "🤚", "✊", "🖐️", "✋", "🖖", "🫱",
      "🫲", "🫳", "🫴", "🫷", "🫸", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "🫵",
      "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "🫶", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶",
      "👂", "🦻", "👃", "🫀", "🧠", "🦷", "🫁", "🦴", "👀", "👁️", "👅", "👄", "🫦", "👶", "👦", "🧒", "👧", "🧑", "👱", "👨",
      "🧔", "🧔‍♂️", "🧔‍♀️", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", "👩", "👩‍🦰", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦳", "🧑‍🦳",
      "👩‍🦲", "🧑‍🦲", "👱‍♀️", "👱‍♂️", "🧓", "👴", "👵", "🙍", "🙍‍♂️", "🙍‍♀️", "🙎", "🙎‍♂️", "🙎‍♀️", "🙅", "🙅‍♂️",
      "🙅‍♀️", "🙆", "🙆‍♂️", "🙆‍♀️", "💁", "💁‍♂️", "💁‍♀️", "🙋", "🙋‍♂️", "🙋‍♀️", "🧏", "🧏‍♀️", "🧏‍♂️", "🙇", "🙇‍♂️",
      "🙇‍♀️", "🤦", "🤦‍♂️", "🤦‍♀️", "🤷", "🤷‍♂️", "🤷‍♀️", "🫅", "🤴", "👳", "👸", "👳‍♂️", "👳‍♀️", "👲", "🧕", "🤵", "👰",
      "🤰", "🤱", "👩‍🍼", "💃", "🕺", "🛀", "🛌", "🧑‍🤝‍🧑", "👭", "👫", "👬", "💏", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩",
      "👨‍❤️‍💋‍👨", "💑", "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", "💌", "💘", "💝", "💖", "💓", "💗", "💞", "💓", "💕", "💟", "❣️",
      "💔", "❤️‍🔥", "❤️‍🩹", "❤️", "🩷", "🧡", "💛", "💚", "💙", "🩵", "💜", "🤎", "🖤", "🩶", "🤍"
    ]
  },
  { emoji: "🦁", content: [] },
  { emoji: "🍉", content: [] },
  { emoji: "🎃", content: [] },
  { emoji: "🌍", content: [] },
  { emoji: "🕶️", content: [] },
  { emoji: "🚮", content: [] },
  { emoji: "🏁", content: [] }
];

const MemoizedEmojiGrid = React.memo(({ emojis, onSelect }) => {
  return (
    <Box sx={{
      height: 200,
      overflowY: 'auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
      gap: '8px',
      p: '8px'
    }}>
      {emojis.map((emoji, index) => (
        <IconButton
          key={`${emoji}-${index}`}
          size="small"
          onClick={() => onSelect(emoji)}
          sx={{
            fontSize: '1.5rem',
            width: 40,
            height: 40,
            padding: 0,
            minWidth: 0
          }}
        >
          {emoji}
        </IconButton>
      ))}
    </Box>
  );
});

const EmojiPicker = ({ onSend }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);


  const activeEmojis = useMemo(() =>
    EMOJI_CATEGORIES[activeTab]?.content || [],
    [activeTab]
  );


  const handleOpen = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleTabChange = useCallback((_, newValue) => {
    setActiveTab(newValue);
  }, []);

  const handleEmojiClick = useCallback((emoji) => {
    onSend(emoji);
    handleClose();
  }, [onSend, handleClose]);

  return (
    <>
      <IconButton onClick={handleOpen} aria-label="Emojis">
        <InsertEmoticon />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transitionDuration={0}
        sx={{
          '& .MuiPopover-paper': {
            width: '300px',
            overflow: 'hidden',
          }
        }}
      >
        <Box>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: '48px',
              '& .MuiTab-root': {
                minWidth: 'unset',
                minHeight: 'unset',
                padding: '8px',
                fontSize: '1.5rem',
              },
            }}
          >
            {EMOJI_CATEGORIES.map((cat, index) => (
              <Tab key={index} label={cat.emoji} sx={{ p: 0 }} />
            ))}
          </Tabs>

          <MemoizedEmojiGrid
            emojis={activeEmojis}
            onSelect={handleEmojiClick}
          />
        </Box>
      </Popover>
    </>
  );
};

export default EmojiPicker;