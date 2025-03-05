// src/types/tawakkalna.d.ts
declare global {
  interface Window {
    TWK: {
      getUserId: () => Promise<{ success: boolean; result: { data: string } }>;
      getUserFullName: () => Promise<{
        success: boolean;
        result: { data: string };
      }>;
      getUserGender: () => Promise<{
        success: boolean;
        result: { data: string };
      }>;
      getUserBirthDate: () => Promise<{
        success: boolean;
        result: { data: string };
      }>;
      getUserBloodType: () => Promise<{
        success: boolean;
        result: { data: string };
      }>;
      addDocument: (
        name: string,
        content: string,
        reference: string,
        category: number
      ) => Promise<{ success: boolean }>;
      updateDocument: (
        name: string,
        content: string,
        reference: string,
        category: number
      ) => Promise<{ success: boolean }>;
      deleteDocument: (
        reference: string,
        category: number
      ) => Promise<{ success: boolean }>;
      version: string;
      [key: string]: any;
    };
    TWKAPIBASE: string;
  }
}

export {};
