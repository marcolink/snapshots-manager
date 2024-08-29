import {UserProps} from "contentful-management";
import {Box, Flex} from "@contentful/f36-core";
import {Avatar} from "@contentful/f36-avatar";
import {Paragraph} from "@contentful/f36-typography";

export function User({user, isLoading = false}: { user?: UserProps, isLoading?: boolean }) {
  return (
    <Flex>
      <Box marginRight={'spacingS'}>
        <Avatar
          isLoading={isLoading}
          size={'tiny'}
          src={user?.avatarUrl}
          alt={`${user?.firstName} ${user?.lastName}`}
        />
      </Box>
      <Paragraph>{user ? `${user?.firstName} ${user?.lastName}`: "Unknown user"}</Paragraph>
      {/*{isLoading || !user*/}
      {/*  ? <Skeleton.Container width={100} speed={3}><Skeleton.BodyText numberOfLines={1}/></Skeleton.Container>*/}
      {/*  : <Paragraph>{`${user?.firstName} ${user?.lastName}`}</Paragraph>}*/}
    </Flex>
  )
}