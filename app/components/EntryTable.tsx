import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useMemo} from "react";
import {Table} from "@contentful/f36-table";
import {Patch} from "generate-json-patch";
import {Badge} from "@contentful/f36-badge";
import {EntryData} from "~/types";
import {RelativeDateTime} from "@contentful/f36-datetime";
import {UserProps} from "contentful-management";
import {OperationBadge} from "~/components/OperationBadge";
import {User} from "~/components/User";

type Data = EntryData & { user?: UserProps }

export function EntryTable({entries, isUsersLoading = false}: { entries: Data[], isUsersLoading?:boolean }) {
  const {accessor} = createColumnHelper<Data>()
  const columns = useMemo(() => [
    accessor('version', {
      header: () => 'Version',
      cell: (info) => <Badge variant={'secondary'}>{info.getValue()}</Badge>
    }),
    accessor('createdAt', {
      header: () => 'Created At',
      cell: (info) => <RelativeDateTime date={info.getValue()}/>
    }),
    accessor('user', {
      header: () => 'User',
      cell: (info) => <User user={info.getValue()} isLoading={isUsersLoading}/>
    }),
    accessor('space', {
      header: () => 'Space',
      cell: (info) => <pre>{info.getValue()}</pre>
    }),
    accessor('environment', {
      header: () => 'Environment',
      cell: (info) => <Badge variant="secondary">{info.getValue()}</Badge>
    }),
    accessor('entry', {
      header: () => 'Entry',
      cell: (info) => <pre>{info.getValue()}</pre>
    }),
    accessor('operation', {
      header: () => 'Operation',
      cell: (info) => <OperationBadge operation={info.getValue()}/>
    }),
    // @ts-ignore
    accessor('matches', {
      header: () => 'Matches',
      // @ts-ignore
      cell: (info) => <Badge variant="secondary">{info.getValue().length -1}</Badge>
    }),
    accessor('patch', {
      header: () => 'Patch Size',
      cell: (info) => {
        const data: Patch = Array.isArray(info.getValue()) ? info.getValue() as Patch : []
        return <div>{data.length}</div>
      }
    })
  ], [isUsersLoading])

  const table = useReactTable({
    data: entries,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnFilters: true,
  })

  const cols = table.getFlatHeaders().length
  const rows = table.getRowModel().rows
  const hasData = Boolean(rows.length)

  return <Table>
    <Table.Head>
      {table.getHeaderGroups().map(headerGroup => (
        <Table.Row key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <Table.Cell key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Head>
    <Table.Body>
      {hasData ? (
        rows.map(row => (
          <Table.Row key={row.id}>
            {row.getVisibleCells().map(cell => (
              <Table.Cell key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext(),
                )}
              </Table.Cell>
            ))}
          </Table.Row>
        ))
      ) : (
        <Table.Row>
          <Table.Cell colSpan={cols}>
            <p> No Data found!</p>
          </Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  </Table>;
}