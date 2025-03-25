import {Modal} from "@contentful/f36-modal";
import {SectionHeading} from "@contentful/f36-typography";
import {PatchEntryWithUser} from "~/types";
import {printVersion} from "~/utils/change-version";
import {formatRelativeDateTime} from "@contentful/f36-datetime";

type Props = {
  entry: PatchEntryWithUser
  onClose: () => void
  isShown: boolean
};

export function EntryDetailsModal({entry, onClose, isShown}: Props) {
  return (
    entry && <Modal onClose={onClose} isShown={isShown} size={'large'}>
      {() => (
        <>
          <Modal.Header
            title={`${printVersion(entry)}`}
            subtitle={formatRelativeDateTime(entry.createdAt)}
            onClose={onClose}
          />
          <Modal.Content>
            <SectionHeading>
              Patch
            </SectionHeading>
              <pre>
                {JSON.stringify(entry.patch, null, 2)}
              </pre>
          </Modal.Content>
        </>
      )}
    </Modal>
  );
}
