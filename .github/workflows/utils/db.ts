import { openDB, DBSchema } from 'idb';
import { ArchiveRecord, ImportedStudent, SchoolSettings } from '../types';

interface SACDatabase extends DBSchema {
  settings: {
    key: string;
    value: SchoolSettings;
  };
  students: {
    key: string;
    value: ImportedStudent[];
  };
  archive: {
    key: string;
    value: ArchiveRecord[];
  };
}

const DB_NAME = 'sac_portal_db';
const DB_VERSION = 1;

// Initialize Database
export const initDB = async () => {
  return openDB<SACDatabase>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
      if (!db.objectStoreNames.contains('students')) {
        db.createObjectStore('students');
      }
      if (!db.objectStoreNames.contains('archive')) {
        db.createObjectStore('archive');
      }
    },
  });
};

// --- SETTINGS OPERATIONS ---
export const saveSettingsToDB = async (settings: SchoolSettings) => {
  const db = await initDB();
  await db.put('settings', settings, 'main_settings');
};

export const getSettingsFromDB = async (): Promise<SchoolSettings | undefined> => {
  const db = await initDB();
  return await db.get('settings', 'main_settings');
};

// --- STUDENTS OPERATIONS ---
export const saveStudentsToDB = async (students: ImportedStudent[]) => {
  const db = await initDB();
  await db.put('students', students, 'all_students');
};

export const getStudentsFromDB = async (): Promise<ImportedStudent[] | undefined> => {
  const db = await initDB();
  return await db.get('students', 'all_students');
};

// --- ARCHIVE OPERATIONS ---
export const saveArchiveToDB = async (archive: ArchiveRecord[]) => {
  const db = await initDB();
  await db.put('archive', archive, 'main_archive');
};

export const getArchiveFromDB = async (): Promise<ArchiveRecord[] | undefined> => {
  const db = await initDB();
  return await db.get('archive', 'main_archive');
};

// Helper to check usage (Optional, just for info)
export const checkStorageUsage = async () => {
    if (navigator.storage && navigator.storage.estimate) {
        const { usage, quota } = await navigator.storage.estimate();
        return {
            usage: usage ? (usage / 1024 / 1024).toFixed(2) + ' MB' : '0 MB',
            quota: quota ? (quota / 1024 / 1024 / 1024).toFixed(2) + ' GB' : 'Unknown'
        };
    }
    return null;
};