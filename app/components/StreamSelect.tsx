import {Button, ButtonGroup, ToggleButton} from "@contentful/f36-button";
import {useState} from "react";
import {StreamsType} from "~/types";
import {StreamKeys} from "~/logic/streams";
import {FormControl, Radio} from "@contentful/f36-forms";
import {Stack} from "@contentful/f36-core";

type Params = {
  selected: StreamsType,
}

export function StreamSelect({selected}: Params) {
  const [localSelected, setLocalSelected] = useState<StreamsType>(StreamKeys.publish);
  return (
    <FormControl>
      <input type={'hidden'} name={'stream'} value={localSelected}/>

      <Stack flexDirection="row">
        <Radio
          id={StreamKeys.publish}
          name={'stream'}
          value={StreamKeys.publish}
          isChecked={selected === StreamKeys.publish}
          onChange={() => setLocalSelected(StreamKeys.publish)}
        >
          {StreamKeys.publish}
        </Radio>
        <Radio
          id={StreamKeys.draft}
          name={'stream'}
          value={StreamKeys.draft}
          isChecked={selected === StreamKeys.draft}
          onChange={() => setLocalSelected(StreamKeys.draft)}
        >
          {StreamKeys.draft}
        </Radio>

      </Stack>

      {/*<ButtonGroup>*/}
      {/*  <ToggleButton*/}
      {/*    key={StreamKeys.publish}*/}
      {/*    isActive={selected === StreamKeys.publish}*/}
      {/*    aria-label={StreamKeys.publish}*/}
      {/*    size="small"*/}
      {/*    onToggle={() => {*/}
      {/*      setLocalSelected(StreamKeys.publish);*/}
      {/*    }}*/}
      {/*  >{StreamKeys.publish}</ToggleButton>*/}
      {/*  <ToggleButton*/}
      {/*    key={StreamKeys.draft}*/}
      {/*    isActive={selected === StreamKeys.draft}*/}
      {/*    aria-label={StreamKeys.draft}*/}
      {/*    size="small"*/}
      {/*    onToggle={() => {*/}
      {/*      setLocalSelected(StreamKeys.draft);*/}
      {/*    }}*/}
      {/*  >{StreamKeys.draft}</ToggleButton>*/}
      {/*</ButtonGroup>*/}
      {/*<Button type={'submit'}>Submit</Button>*/}
    </FormControl>
  )
}