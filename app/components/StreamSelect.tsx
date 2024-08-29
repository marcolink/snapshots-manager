import {Button, ButtonGroup, ToggleButton} from "@contentful/f36-button";
import {useState} from "react";
import {StreamsType} from "~/types";
import {StreamKeys} from "~/logic/streams";

type Params = {
  selected: StreamsType,
}

export function StreamSelect({selected}: Params) {
  const [localSelected, setLocalSelected] = useState<StreamsType>(StreamKeys.publish);
  console.log('StreamSelect', selected, localSelected)

  return (
    <>
      <input type={'hidden'} name={'stream'} value={localSelected}/>
      <ButtonGroup>
        <ToggleButton
          key={StreamKeys.publish}
          isActive={selected === StreamKeys.publish}
          aria-label={StreamKeys.publish}
          size="small"
          onToggle={() => {
            setLocalSelected(StreamKeys.publish);
          }}
        >{StreamKeys.publish}</ToggleButton>
        <ToggleButton
          key={StreamKeys.draft}
          isActive={selected === StreamKeys.draft}
          aria-label={StreamKeys.draft}
          size="small"
          onToggle={() => {
            setLocalSelected(StreamKeys.draft);
          }}
        >{StreamKeys.draft}</ToggleButton>
      </ButtonGroup>
      {/*<Button type={'submit'}>Submit</Button>*/}
    </>
  )
}