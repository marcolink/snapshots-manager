import {SelectEntry} from "~/database/schema";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useMemo} from "react";
import {Table} from "@contentful/f36-table";
import {Jsonify} from "@remix-run/server-runtime/dist/jsonify";
import {Patch} from "generate-json-patch";


type Data = Jsonify<SelectEntry>

export function EntryTable({entries}: { entries: Data[] }) {
  const {accessor} = createColumnHelper<Data>()
  const columns = useMemo(() => [
    accessor('version', {
      header: () => 'Version',
      cell: (info) => <div>{info.getValue()}</div>
    }),
    accessor('createdAt', {
      header: () => 'Created At',
      cell: (info) => <div>{info.getValue()}</div>
    }),
    accessor('space', {
      header: () => 'Space',
      cell: (info) => <div>{info.getValue()}</div>
    }),
    accessor('environment', {
      header: () => 'Environment',
      cell: (info) => <div>{info.getValue()}</div>
    }),
    accessor('entry', {
      header: () => 'Entry',
      cell: (info) => <div>{info.getValue()}</div>
    }),
    accessor('patch', {
      header: () => 'Patch Size',
      cell: (info) => {
        const data: Patch = Array.isArray(info.getValue()) ? info.getValue() as Patch : []
        return <div>{data.length}</div>
      }
    })
  ], [])

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