import { History, HistoryItem } from '@/hooks/useGameHistory';
import RNFS from 'react-native-fs';

const FOLDER_PATH = RNFS.DocumentDirectoryPath;

const generateFolderName = () => {
    return `Game_${new Date().valueOf()}`;
};

const createFolder = async (folderName: string) => {
    const folderPath = `${FOLDER_PATH}/${folderName}`;
    await RNFS.mkdir(folderPath);
};

const createFile = async (folderName: string, fileName: string, content: string) => {
    const filePath = `${FOLDER_PATH}/${folderName}/${fileName}`;
    await RNFS.writeFile(filePath, content);
};

const checkFileExists = async (folderName: string, fileName: string) => {
    const filePath = `${FOLDER_PATH}/${folderName}/${fileName}`;
    return await RNFS.exists(filePath);
};

const readFileContent = async (folderName: string, fileName: string) => {
    const filePath = `${FOLDER_PATH}/${folderName}/${fileName}`;
    return await RNFS.readFile(filePath, 'utf8');
};

type HistoryEncodeDataItem = {
    id: number;
    p: number;
    h: 0 | 1;
};

type HistoryEncodeItem = {
    d: HistoryEncodeDataItem[];
    m: 0 | 1;
    r: number;
};

const parseHistoryContent = (content: string): History => {
    const data = JSON.parse(content);
    const history = data?.history?.map((item: HistoryEncodeItem) => ({
        data: item.d.map((data) => ({
            id: data.id,
            point: data.p,
            host: data.h === 1,
        })),
        mode: item.m === 0 ? 'free' : 'with-host',
        row: item.r,
    }));
    return ({ playerData: data?.playerData, history });
};

const deleteFile = async (folderName: string, fileName: string) => {
    const filePath = `${FOLDER_PATH}/${folderName}/${fileName}`;
    await RNFS.unlink(filePath);
};

const deleteFolder = async (folderName: string) => {
    const folderPath = `${FOLDER_PATH}/${folderName}`;
    await RNFS.unlink(folderPath);
};

const initFolder = async (folderName: string) => {
    await createFolder(folderName);
};

const getFolderList = async () => {
    return await RNFS.readDir(FOLDER_PATH);
};

const deleteAllFolder = async () => {
    const folderList = await getFolderList();
    folderList.forEach(async (folder) => {
        await deleteFolder(folder.name);
    });
};

const deleteAllGameFolder = async () => {
    const folderList = await getFolderList();
    const gameFolderList = folderList.filter((folder) => folder.name.startsWith('Game_'));
    gameFolderList.forEach(async (folder) => {
        await deleteFolder(folder.name);
    });
};

const countGame = async () => {
    const folderList = await getFolderList();
    const gameFolderList = folderList.filter((folder) => folder.name.startsWith('Game_'));
    return gameFolderList.length;
}

export const folderHelpers = {
    FOLDER_PATH,
    generateFolderName,
    createFolder,
    createFile,
    checkFileExists,
    deleteFile,
    deleteFolder,
    initFolder,
    readFileContent,
    getFolderList,
    deleteAllFolder,
    deleteAllGameFolder,
    parseHistoryContent,
    countGame,
};