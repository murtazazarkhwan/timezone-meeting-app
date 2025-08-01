// "use client";

// import { useState, useEffect } from "react";
// import { initDB } from "@/lib/db";

// export function useIndexedDB<T>(
//   storeName: string,
//   method: "get" | "getAll" | "add" | "put" | "delete",
//   key?: string | string[],
//   value?: any
// ): {
//   result: T | T[] | null;
//   error: Error | null;
//   loading: boolean;
//   execute: (
//     newKey?: string | string[],
//     newValue?: any
//   ) => Promise<T | T[] | null>;
// } {
//   const [result, setResult] = useState<T | T[] | null>(null);
//   const [error, setError] = useState<Error | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const execute = async (
//     newKey?: string | string[],
//     newValue?: any
//   ): Promise<T | T[] | null> => {
//     setLoading(true);
//     setError(null);

//     try {
//       const db = await initDB();
//       const transaction = db.transaction(
//         [storeName],
//         method === "get" || method === "getAll" ? "readonly" : "readwrite"
//       );
//       const store = transaction.objectStore(storeName);

//       let request: IDBRequest;

//       const useKey = newKey !== undefined ? newKey : key;
//       const useValue = newValue !== undefined ? newValue : value;

//       switch (method) {
//         case "get":
//           request = store.get(useKey as string);
//           break;
//         case "getAll":
//           if (useKey) {
//             const index = store.index(useKey as string);
//             request = index.getAll();
//           } else {
//             request = store.getAll();
//           }
//           break;
//         case "add":
//           request = store.add(useValue);
//           break;
//         case "put":
//           request = store.put(useValue);
//           break;
//         case "delete":
//           request = store.delete(useKey as string);
//           break;
//         default:
//           throw new Error(`Unsupported method: ${method}`);
//       }

//       return new Promise((resolve, reject) => {
//         request.onsuccess = () => {
//           const result =
//             method === "get" || method === "getAll" ? request.result : useValue;
//           setResult(result);
//           setLoading(false);
//           resolve(result);
//         };

//         request.onerror = () => {
//           const error = new Error(`IndexedDB error: ${request.error}`);
//           setError(error);
//           setLoading(false);
//           reject(error);
//         };
//       });
//     } catch (err) {
//       const error = err instanceof Error ? err : new Error(String(err));
//       setError(error);
//       setLoading(false);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     if ((method === "get" || method === "getAll") && key !== undefined) {
//       execute();
//     }
//   }, [method, key, storeName]);

//   return { result, error, loading, execute };
// }
