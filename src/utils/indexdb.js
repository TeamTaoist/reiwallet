import Dexie from "dexie";


const db = new Dexie("CKB_DB");
db.version(1).stores({
    history_list: "++id,type,status,from,to,gas,txHash,amount,created",
});

export const insertPR = async(item) =>{
     await db.history_list.add(item);
}
export const clearPR = async() =>{
    await db.history_list.clear();
}
// export const removePR = async(key) =>{
//      await db.history_list.delete(key);
// }
// export const updatePR = async(item) =>{
//     const{id} = item;
//     await db.history_list.update(id,item);
// }

// export const getPR = async (key) =>{
//     return await db.history_list.get(key);
// }
export const getHistoryList = async () =>{
    console.log(db.history_list)
    return await db.history_list.toCollection().sortBy("created");
}
