"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CommonDataTable({
  columns,
  data,
  onRowClick,
  loading
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  const handlerRowClick = (clickedRow) => {
    if (onRowClick) {
      onRowClick(clickedRow);
    }
  }



  return (
    <>

      <div className="rounded-2xl border">

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading && <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center" align="center">
                <div>
                  <LoaderCircle className='w-10 h-10 animate-spin inline-block' strokeWidth={0.8} />
                </div>
              </TableCell>
            </TableRow>}
            {!loading && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    // onClick={() => handlerRowClick(row.original)}
                    className={`${row?.original?.isNew ? 'bg-blue-50' : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : !loading && <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
            }
          </TableBody>
        </Table>
      </div>
      
    </>
  )
}
