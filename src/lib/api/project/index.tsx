import { ProjectResponse } from "@/lib/api/project/dto";

export const getProjectInfo = async (
  _token: string
): Promise<ProjectResponse> => {
  return {
    id: "body-smith",
    name: "Body Smith",
    attribute: [
      {
        title: "블로그",
        url: "/",
        order: 1,
      },
    ],
    project_key: "body-smith",
    lang: [],
  };
};

export const getProjectPermission = async (
  _token: string
): Promise<{ hasPermission: boolean }> => {
  return { hasPermission: true };
};
