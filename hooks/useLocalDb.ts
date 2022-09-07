import { useCallback } from "react";
import { db } from '../lib/db';
import { Post } from "../lib/posts";

export function useLocalDb () {

  const writePostToLocalDB = useCallback((post: Post) => {
    const { userId, uuid, resourceUrl, publicId, width, height, resourceType } = post;
    const { publicly, category, description, createdAt, updatedAt } = post;
    return new Promise<string>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(`
          insert into posts 
          (userId, uuid, resourceUrl, publicId, width, height, resourceType, 
          publicly, category, description, createdAt, updatedAt) 
          values 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            userId, uuid, resourceUrl, publicId || "", width || 0, height || 0, resourceType,
            Number(publicly) || 0, category, description, createdAt.getTime().toString(), updatedAt.getTime().toString()
          ]);
        },
        (error) => reject(error.message || "Something went wrong, please try again"),
        () => resolve(""),
      );
    });
  }, []);

  const removePostFromLocalDB = useCallback((uuid: string) => {
    db.transaction((tx) => {
      tx.executeSql(`delete from posts where uuid = ?;`, [uuid])
    });
  }, [db.transaction]);

  return { writePostToLocalDB, removePostFromLocalDB }  

}