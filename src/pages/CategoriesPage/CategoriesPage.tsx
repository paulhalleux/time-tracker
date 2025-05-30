import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence } from "motion/react";
import { useCallback } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";

import { Table } from "../../components";
import { useDeleteCategory } from "../../hooks/mutation";
import { useQueryCategories } from "../../hooks/query";
import type { TrackerCategory } from "../../types/tracker.ts";
import styles from "./CategoriesPage.module.css";
import { CreateCategoryModal } from "./CreateCategoryModal.tsx";
import { EditCategoryModal } from "./EditCategoryModal.tsx";

const columnHelper = createColumnHelper<TrackerCategory>();

export function CategoriesPage() {
  const query = useQueryCategories();
  const deleteCategory = useDeleteCategory();

  const navigate = useNavigate();
  const onEdit = useCallback(
    (id: string) => {
      navigate(`/categories/${id}/edit`);
    },
    [navigate],
  );

  const location = useLocation();

  const table = useReactTable<TrackerCategory>({
    columns: [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) =>
          info.getValue() || (
            <span className={styles.noDescription}>
              No description provided
            </span>
          ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        meta: {
          align: "right",
        },
        cell: (info) => (
          <Table.Actions>
            <Table.Action onClick={() => onEdit(info.row.original.id)}>
              Edit
            </Table.Action>
            <Table.Action
              onClick={() =>
                deleteCategory.mutate({ id: info.row.original.id })
              }
            >
              Delete
            </Table.Action>
          </Table.Actions>
        ),
      }),
    ],
    data: query.data || [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.page}>
      <AnimatePresence>
        <Routes location={location} key={location.key}>
          <Route path="/new" element={<CreateCategoryModal />} />
          <Route path="/:id/edit" element={<EditCategoryModal />} />
        </Routes>
      </AnimatePresence>
      <Table>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.HeaderCell
                  key={header.id}
                  align={header.column.columnDef.meta?.align}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Cell
                  key={cell.id}
                  align={cell.column.columnDef.meta?.align}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
