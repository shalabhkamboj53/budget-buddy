import React from "react"

export type routePathType = {
    path: string,
    components: React.FC,
    isPrivate: boolean
}

export type Income = {
    id?: string;
    userId: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    note?: string;
    createdAt: string;
    updatedAt?: string;
  }

  export type Expense =  {
    id?: string;
    userId: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    note?: string;
    createdAt: string;
    updatedAt?: string;
  }