import { format } from "date-fns";

export const parseYYYYMMDD = (dateString: string) => {
  return dateString ? format(new Date(dateString), "yyyy-MM-dd") : "";
};
