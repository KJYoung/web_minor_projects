/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchTags, fetchTagsIndex, selectTag } from '../store/slices/tag';
import { TagBubbleCompact } from '../components/general/TagBubble';
import { IPropsColor } from '../utils/Interfaces';
import { getContrastYIQ } from '../styles/color';
import { CondRendAnimState, defaultCondRendAnimState, toggleCondRendAnimState } from '../utils/Rendering';
import { TagClassAdder, TagClassAdderHeight, TagClassEditor } from '../components/Tag/TagClassAdder';
import { TagAdder, TagEditor } from '../components/Tag/TagAdder';

enum TagViewerMode {
  TagClass, Tag, TagPreset
};

const TagMain = () => {
  const [addMode, setAddMode] = useState<CondRendAnimState>(defaultCondRendAnimState);
  const [tagViewerMode, setTagViewerMode] = useState<TagViewerMode>(TagViewerMode.TagClass);
  const dispatch = useDispatch<AppDispatch>();

  const { elements, index, errorState } = useSelector(selectTag);

  // Fetch Tag Related Things!
  useEffect(() => {
      dispatch(fetchTags());
      dispatch(fetchTagsIndex());
    }, [dispatch, errorState]);

  const classEditHandler = () => {

  }

  const classAddToggleHandler = () => {
    toggleCondRendAnimState(addMode, setAddMode); // ON
  };

  const tabChangeHandler = (newTabState : TagViewerMode) => {
    if(newTabState === tagViewerMode)
      return;
    if(addMode.showElem)
      classAddToggleHandler();
    setTagViewerMode(newTabState);
  };

  return (
    <Wrapper>
      <InnerWrapper>
        <LeftWrapper>
          <ListWrapper>
            <TagTabHeader>
              <div>
                <span onClick={() => tabChangeHandler(TagViewerMode.TagClass)}>TagClass</span>
                <span onClick={() => tabChangeHandler(TagViewerMode.Tag)}>Tag</span>
                <span onClick={() => tabChangeHandler(TagViewerMode.TagPreset)}>TagPreset</span>
              </div>
              <div>
                <span onClick={classAddToggleHandler}>+</span>
              </div>
            </TagTabHeader>
            {
              tagViewerMode === TagViewerMode.TagClass && <TagClassListPosition>
                {addMode.showElem && ( true ? 
                    (<TagClassAdder addMode={addMode} setAddMode={setAddMode} />)
              :
                    (elements[0] && <TagClassEditor addMode={addMode} setAddMode={setAddMode} editObj={elements[0]} editCompleteHandler={classEditHandler}/>)
                )}
                <TagClassList style={addMode.showElem && addMode.isMounted ? { transform: `translateY(${TagClassAdderHeight})` } : { transform: "translateY(0px)" }}>
                  {elements.map((tagClass) => {
                      return <TagClassListElement key={tagClass.id}>
                          <TagClassListElementHeader color={tagClass.color}>{tagClass.name}</TagClassListElementHeader>
                          <div>
                              {tagClass.tags?.map((tag) => {
                                  return <TagBubbleCompact color={tag.color} key={tag.id}>{tag.name}</TagBubbleCompact>
                              })}
                          </div>
                      </TagClassListElement>
                  })}
                </TagClassList>         
              </TagClassListPosition>
            }
            {
              tagViewerMode === TagViewerMode.Tag && <TagClassListPosition>
                {addMode.showElem && ( true ? 
                    (<TagAdder addMode={addMode} setAddMode={setAddMode} />)
              :
                    (elements[0] && <TagEditor addMode={addMode} setAddMode={setAddMode} editObj={elements[0]} editCompleteHandler={classEditHandler}/>)
                )}
                <TagClassList style={addMode.showElem && addMode.isMounted ? { transform: `translateY(${TagClassAdderHeight})` } : { transform: "translateY(0px)" }}>
                    {index.map((tag) => {
                        return <TagBubbleCompact color={tag.color} key={tag.id}>{tag.name}</TagBubbleCompact>
                    })}     
                </TagClassList>         
              </TagClassListPosition>
            }
            {
              tagViewerMode === TagViewerMode.TagPreset && <TagClassListPosition>
                {addMode.showElem && ( true ? 
                    (<TagClassAdder addMode={addMode} setAddMode={setAddMode} />)
              :
                    (elements[0] && <TagClassEditor addMode={addMode} setAddMode={setAddMode} editObj={elements[0]} editCompleteHandler={classEditHandler}/>)
                )}
                <TagClassList style={addMode.showElem && addMode.isMounted ? { transform: `translateY(${TagClassAdderHeight})` } : { transform: "translateY(0px)" }}>
                  Preset
                </TagClassList>         
              </TagClassListPosition>
            }
          </ListWrapper>
        </LeftWrapper>
        <RightWrapper>

        </RightWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default TagMain;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const InnerWrapper = styled.div`
  width: 100%;
  height: 92%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
`;

const LeftWrapper = styled.div`
  width: 1500px;
  height: 100%;
  padding: 30px 0px 0px 30px;

  display: flex;
  flex-direction: column;
`;

const RightWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px 30px 0px 15px;

  display: flex;
  flex-direction: column;

  > div {
    width: 100%;
    height: 100%;
  }
`;

const ListWrapper = styled.div`
  width: 100%;
`;

const TagTabHeader = styled.div`
  font-size: 28px;
  padding: 4px;
  border-bottom: 1px solid black;

  display: grid;
  grid-template-columns: 8fr 2fr;
  
  > div:first-child {
    display: flex;
    justify-content: space-between;
  }

  > div:last-child {
    display: flex;
    justify-content: center;
  }
`;


const TagClassListPosition = styled.div`
  width: 100%;
  position: relative;
`;

const TagClassList = styled.div`
  margin-bottom: 20px;

  position: absolute;
  top: 0px;

  transition-property: all;
  transition-duration: 250ms;
  transition-delay: 0s;
`;

const TagClassListElement = styled.div`
  margin-bottom: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  border-bottom: 1px solid black;

  &:first-child{
    padding-top: 10px;
  }
`;

const TagClassListElementHeader = styled.div<IPropsColor>`
  padding: 6px 10px 6px 10px;
  width: 200px;
  border-radius: 10px;
  text-align: center;

  margin-bottom: 4px;
  ${({ color }) =>
    color &&
    `
      background: ${color};
      color: ${getContrastYIQ(color)}
    `}
`;