const DB_NAME = 'ReFrameDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};


export const saveImagesToDB = async (files) => {
  try {
    const promises = Array.from(files).map(file => fileToBase64(file));
    const base64List = await Promise.all(promises);

    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    base64List.forEach(base64 => {
      store.add({ data: base64, date: new Date() });
    });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  } catch (error) {
    console.error("Erro ao salvar:", error);
    throw error;
  }
};

export const loadImagesFromDB = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const images = request.result.map(item => item.data);
      resolve(images);
    };
    request.onerror = () => reject('Erro ao ler DB');
  });
};

export const deleteImageFromDB = async (imageData) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const request = store.openCursor();

  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      if (cursor.value.data === imageData) cursor.delete();
      else cursor.continue();
    }
  };
};

export const clearDB = async () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);

    req.onsuccess = () => {
      console.log("Database successfully deleted");
      resolve();
    };

    req.onerror = (event) => {
      console.error("Error deleting database:", event);
      reject();
    };

    req.onblocked = () => {
      console.warn("Deletion blocked (another tab open?)");
      resolve();
    };
  });
};