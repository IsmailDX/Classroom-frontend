import { MOCK_SUBJECTS } from "@/constants/mock-data";
import {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";
// import { createSimpleRestDataProvider } from '@refinedev/rest/simple-rest'
// import { API_URL } from './constants'

// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//     apiURL: API_URL,
// })

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") {
      return { data: [] as TData[], total: 0 };
    }

    return {
      data: MOCK_SUBJECTS as unknown as TData[],
      total: MOCK_SUBJECTS.length,
    };
  },

  getOne: async () => {
    throw new Error("Method not implemented.");
  },
  create: async () => {
    throw new Error("Method not implemented.");
  },
  update: async () => {
    throw new Error("Method not implemented.");
  },
  deleteOne: async () => {
    throw new Error("Method not implemented.");
  },

  getApiUrl: () => "",
};
