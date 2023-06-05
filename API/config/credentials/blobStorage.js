// Incluye la librería de Azure Storage Blob
const { BlobServiceClient } = require("@azure/storage-blob");

// Configuración de la cuenta de Azure Storage
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

// Crea un cliente de servicio blob de Azure Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);