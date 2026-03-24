import { JSX } from "react";

export interface ProjectRequest {
  access_token: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  attribute: {
    title: string;
    url: string;
    order: number;
    icon?: JSX.Element;
  }[];
  project_key: string;
  lang: string[];
}
