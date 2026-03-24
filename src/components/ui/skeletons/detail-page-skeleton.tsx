import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import { Skeleton } from "@/components/ui/skeletons/skeleton";

// MediaDetail Skeleton 컴포넌트
export const DetailPageSkeleton: React.FC = () => {
  return (
    <Main>
      {/* 헤더 스켈레톤 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-9 w-[100px]" />
          <div>
            <Skeleton className="h-8 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-[80px]" />
        </div>
      </div>

      {/* 탭 스켈레톤 */}
      <div className="space-y-6">
        <div className="grid w-full grid-cols-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* 기본 정보 탭 스켈레톤 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 기본 정보 카드 스켈레톤 */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[50px]" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-[40px]" />
                <Skeleton className="h-20 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-[50px]" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-[200px]" />
              </div>
            </CardContent>
          </Card>

          {/* 일정 및 미디어 카드 스켈레톤 */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[280px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-10 w-full" />
                <div className="mt-2">
                  <Skeleton className="h-32 w-full rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 내용 편집 카드 스켈레톤 */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[100px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent className="pb-15">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[50px]" />
              <Skeleton className="h-[600px] w-full" />
            </div>
          </CardContent>
        </Card>

        {/* SEO 설정 카드 스켈레톤 */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[100px] mb-2" />
            <Skeleton className="h-4 w-[320px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <div className="flex space-x-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-[60px]" />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-6 w-[100px]" />
                <Skeleton className="h-6 w-[60px]" />
                <Skeleton className="h-6 w-[90px]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 기타 설정 카드 스켈레톤 */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[50px]" />
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-[60px]" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-[50px]" />
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  );
};
