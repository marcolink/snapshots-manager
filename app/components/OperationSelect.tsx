import {ButtonGroup, ToggleButton} from "@contentful/f36-button";
import {useState} from "react";
import {WebhookActions} from "~/types";
import {OperationMap} from "~/components/OperationBadge";
import {OccurrenceEntry, useActionOccurrences} from "~/hooks/useActionOccurrences";

type Params = {
  entries: OccurrenceEntry[]
}

export function OperationSelect({entries}: Params) {
  const occurrences = useActionOccurrences(entries)
  const [selected, setSelected] = useState<WebhookActions | 'all'>('all');

  return (
    <ButtonGroup>
      {Object.keys(OperationMap).map((operation) => {
        return <ToggleButton
          key={operation}
          isActive={selected === operation}
          aria-label={operation}
          size="small"
          onToggle={() => {
            setSelected(operation as WebhookActions);
          }}
        >{operation} ({occurrences[operation as WebhookActions] ?? 0})</ToggleButton>
      })}
    </ButtonGroup>
  )
}