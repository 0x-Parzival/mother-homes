import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnect from './db/db.connect.js';
import { seedAmenitiesAndServices } from './entities/serives&Amenties.entity.js';
import { BulkUploadService } from './services/BulkUpload.service.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
    try {
        logger.info("Starting database seeding...");

        // 1. Connect to Database
        await dbConnect();

        // 2. Seed Amenities and Services
        logger.info("Seeding Amenities and Services...");
        await seedAmenitiesAndServices();
        logger.info("Amenities and Services seeded successfully.");

        // 3. Seed Properties from Excel
        const excelPath = path.join(__dirname, '../test_properties.xlsx');
        if (fs.existsSync(excelPath)) {
            logger.info(`Found excel file at ${excelPath}. Starting bulk upload...`);
            const fileBuffer = fs.readFileSync(excelPath);
            const bulkUploadService = new BulkUploadService();
            const result = await bulkUploadService.processExcelFile(fileBuffer);
            logger.info(`Bulk upload completed. Success: ${result.successCount}, Errors: ${result.errors.length}`);
        } else {
            logger.warn(`Excel file not found at ${excelPath}. Skipping property seeding.`);
        }

        logger.info("Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        logger.error("Seeding failed:", error);
        process.exit(1);
    }
}

runSeed();
