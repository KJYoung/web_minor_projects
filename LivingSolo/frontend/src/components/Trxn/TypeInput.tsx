import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { styled as styledMUI } from '@mui/material/styles';
import { RoundButton } from '../../utils/Button';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { TagBubbleCompact } from '../general/TypeBubble';
import { useSelector } from 'react-redux';
import { TypeBubbleElement, selectTrxnType } from '../../store/slices/trxnType';

interface TypeDialogProps {
  open: boolean,
  handleClose: () => void,
  initialTags?: TypeBubbleElement[],
  setTags: React.Dispatch<React.SetStateAction<TypeBubbleElement[]>>,
  tagClassSelect: string,
  setTagClassSelect: React.Dispatch<React.SetStateAction<string>>,
}

const DEFAULT_OPTION = '$NONE$';
// const NEW_OPTION = '$NEW$';
// const SEARCH_OPTION = '$SEARCH$';

const TypeDialog = ({open, handleClose, initialTags, setTags, tagClassSelect, setTagClassSelect} : TypeDialogProps) => {
  const { elements, index } = useSelector(selectTrxnType);

  
  const [tagSelect, setTagSelect] = useState(DEFAULT_OPTION); // Tag select value
  // const [currentTagClass, setCurrentTagClass] = useState<TagClass | null>(null);

  return <div>
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogBody>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Tag for Transaction
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            현재 설정된 태그:
            <span>{initialTags?.map((ee) => <TagBubbleCompact key={ee.id} color={ee.color}>{ee.name}</TagBubbleCompact>)}</span>
          </Typography>
          <Typography gutterBottom>
            태그 목록.
            <select data-testid="tagSelect" value={tagClassSelect} onChange={(e) => setTagClassSelect(e.target.value)}>
              <option disabled value={DEFAULT_OPTION}>
                - 태그 클래스 -
              </option>
              {elements.map(tag => {
                  return (
                    <option value={tag.id} key={tag.id}>
                      {tag.name}
                    </option>
                  );
                })}
            </select>
            <select data-testid="tagSelect2" value={tagSelect} onChange={(e) => {
              const matchedElem = index.find((elem) => {
                // console.log(`${elem.id.toString()} vs ${e.target.value}`);
                return elem.id.toString() === e.target.value;
              });
              if(matchedElem)
                setTags((array) => [...array, matchedElem]);
              setTagSelect(DEFAULT_OPTION);
            }}>
              <option disabled value={DEFAULT_OPTION}>
                - 태그 이름 -
              </option>
              {elements.filter(tagClass => tagClass.id === Number(tagClassSelect))[0]?.types?.map(tag => {
                return (
                  <option value={tag.id} key={tag.id}>
                    {tag.name}
                  </option>
                );
              })}
            </select>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            닫기
          </Button>
        </DialogActions>
      </DialogBody>
      
    </BootstrapDialog>
  </div>
}

const BootstrapDialog = styledMUI(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const DialogBody = styled.div`
  width: 500px;
`;

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface TypeInputProps {
  tags: TypeBubbleElement[],
  setTags: React.Dispatch<React.SetStateAction<TypeBubbleElement[]>>
}
// Type Input Container.
function TypeInput({ tags, setTags }: TypeInputProps) {
  const { elements }  = useSelector(selectTrxnType);
  const [tagClassSelect, setTagClassSelect] = useState<string>(DEFAULT_OPTION); // Tag Class select value
  const [open, setOpen] = React.useState<boolean>(false);
  
  useEffect(() => {
    setTags([]);
  }, [elements, setTags]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const clearTagInput = () => {
    setTags([]);
    setTagClassSelect(DEFAULT_OPTION);
  }

  return (
    <TypeInputDiv>
        <div>
          {tags.map((ee) => <TagBubbleCompact key={ee.id} color={ee.color}>{ee.name}</TagBubbleCompact>)}
        </div>
        <TypeInputClearSpan onClick={() => clearTagInput()}active={(tags.length !== 0).toString()}>Clear</TypeInputClearSpan>
        <RoundButton onClick={handleClickOpen}>+</RoundButton>
        <TypeDialog open={open} handleClose={handleClose} initialTags={tags} setTags={setTags} tagClassSelect={tagClassSelect} setTagClassSelect={setTagClassSelect} />
    </TypeInputDiv>
  );
}

const TypeInputDiv = styled.div`
    background-color: var(--ls-gray_lighter2);
    border: 1px solid var(--ls-gray_lighter);
    padding: 5px;
    border-radius: 5px;
    
    display: grid;
    place-items: center;
    grid-template-columns: 6fr 1fr 1fr;
`;

const TypeInputClearSpan = styled.span<{ active: string }>`
    margin-top: 3px;
    font-size: 17px;
    color: ${props => ((props.active === 'true') ? 'var(--ls-blue)' : 'var(--ls-gray)')};
    background-color: transparent;
    cursor: ${props => ((props.active === 'true') ? 'pointer' : 'default')};;
    margin-left: 20px;
`;

export default TypeInput;