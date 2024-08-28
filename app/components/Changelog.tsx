import {formatRelativeDateTime} from "@contentful/f36-datetime";
import {EntryData} from "~/types";
import {UserProps} from "contentful-management";
import {Card} from "@contentful/f36-card";
import {Stack} from "@contentful/f36-core";
import {OperationBadge} from "~/components/OperationBadge";
import {User} from "~/components/User";

type Data = EntryData & { user?: UserProps }

export function Changelog({entries}: { entries: Data[] }) {

  return (
    <Stack flexDirection={'column'} alignItems="center">
      {entries.map((entry) => (
        <Card
          style={{width: '30%', minWidth: '500px'}}
          badge={<OperationBadge operation={entry.operation}/>}
          key={entry.id}
          marginBottom={'spacingM'}
          title={`v${entry.version} - ${formatRelativeDateTime(entry.createdAt)}`}
        >
          <User user={entry.user}/>
        </Card>
      ))}
    </Stack>
  );
}