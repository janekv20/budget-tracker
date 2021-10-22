//variable to hold db connection
let db;
//Connection to IndexDB database
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('transaction', {autoIncrememt: true });
};

request.onsucces = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        uploadTransaction()
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['transaction'], 'readwrite');
    const store = transaction.objectStore('transaction');

    store.add(record);
}