import {UserProps} from "contentful-management";
import {Box, Flex} from "@contentful/f36-core";
import {Avatar} from "@contentful/f36-avatar";
import {Paragraph} from "@contentful/f36-typography";

export function User({user}: { user?: UserProps }) {
  return (
    <Flex>
      <Box marginRight={'spacingS'}>
        <Avatar
          size={'tiny'}
          src={user?.avatarUrl}
          alt={`${user?.firstName} ${user?.lastName}`}
        />
      </Box>
      <Paragraph>{`${user?.firstName} ${user?.lastName}`}</Paragraph>
    </Flex>
  )
}