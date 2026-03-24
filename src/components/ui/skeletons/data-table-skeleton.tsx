import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "./skeleton";

// DataTable Skeleton 컴포넌트
export const DataTableSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 툴바 스켈레톤 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-8 w-[70px]" />
          <Skeleton className="h-8 w-[70px]" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-[70px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
      </div>

      {/* 테이블 스켈레톤 */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <Skeleton className="h-4 w-6" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-8" />
              </TableHead>
              <TableHead className="w-[100px]">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead className="w-[100px]">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead className="w-[80px]">
                <Skeleton className="h-4 w-10" />
              </TableHead>
              <TableHead className="w-[100px]">
                <Skeleton className="h-4 w-10" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 17 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[180px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[250px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 스켈레톤 */}
      <div className="flex items-center justify-between px-2">
        <Skeleton className="h-4 w-[100px]" />
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[70px]" />
          </div>
          <div className="flex w-[100px] items-center justify-center">
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};
