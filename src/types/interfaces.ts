export interface IFieldData {
   name: string;
   type: string;
}

export interface ICreateTableData {
   tableName: string;
   fields: IFieldData[]
}

export interface IApiResponse {
   status: ApiStatusProps
   message: string
}

export interface IApiStatus {
   status: 'success' | 'error'
}

export type IApiId = string | number

type ApiStatusProps= 'success' | 'error'