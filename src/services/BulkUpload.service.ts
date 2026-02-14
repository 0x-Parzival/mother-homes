
import * as xlsx from 'xlsx';
import PropertyModel from '../entities/Properties.entity.js';
import { AmenityModel, ServiceModel } from '../entities/serives&Amenties.entity.js';

export class BulkUploadService {
    async processExcelFile(fileBuffer: Buffer) {
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data: any[] = xlsx.utils.sheet_to_json(sheet);

        const propertiesToCreate = [];
        const errors = [];

        // Pre-fetch all amenities and services to map names to IDs
        const allAmenities = await AmenityModel.find({});
        const allServices = await ServiceModel.find({});

        const amenityMap = new Map(allAmenities.map(a => [a.name.toLowerCase(), a._id]));
        const serviceMap = new Map(allServices.map(s => [s.name.toLowerCase(), s._id]));

        for (const [index, row] of data.entries()) {
            try {
                // Basic Validation
                if (!row.property_name || !row.address || !row.city || !row.state || !row.rate || !row.category) {
                    throw new Error(`Missing required fields in row ${index + 2}`);
                }

                // Map Amenities
                const amenityIds = [];
                if (row.amenities) {
                    const amenityNames = row.amenities.split(',').map((s: string) => s.trim().toLowerCase());
                    for (const name of amenityNames) {
                        if (amenityMap.has(name)) {
                            amenityIds.push(amenityMap.get(name));
                        }
                    }
                }

                // Map Services
                const serviceIds = [];
                if (row.services) {
                    const serviceNames = row.services.split(',').map((s: string) => s.trim().toLowerCase());
                    for (const name of serviceNames) {
                        if (serviceMap.has(name)) {
                            serviceIds.push(serviceMap.get(name));
                        }
                    }
                }

                // Handle Images (comma-separated URLs)
                let images: string[] = [];
                if (row.images) {
                    images = row.images.split(',').map((url: string) => url.trim());
                }

                // Handle Videos (comma-separated URLs)
                let videos: string[] = [];
                if (row.videos) {
                    videos = row.videos.split(',').map((url: string) => url.trim());
                }

                // Construct Property Object
                const propertyData = {
                    property_name: row.property_name,
                    description: row.description || '',
                    rate: String(row.rate),
                    category: row.category.toLowerCase(),
                    amenities: amenityIds,
                    services: serviceIds,
                    images: images,
                    videos: videos,
                    perPersonPrice: row.perPersonPrice ? String(row.perPersonPrice) : undefined,
                    totalCapacity: row.totalCapacity ? String(row.totalCapacity) : undefined,
                    furnishing_type: row.furnishing_type || 'Raw',
                    city: row.city,
                    state: row.state,
                    address: row.address,
                    flat_no: row.flat_no,
                    area: row.area ? String(row.area) : '',
                    latitude: row.latitude ? String(row.latitude) : undefined,
                    longitude: row.longitude ? String(row.longitude) : undefined,
                    bed: row.bed ? Number(row.bed) : 0,
                    bathroom: row.bathroom ? Number(row.bathroom) : 0,
                    availability: row.availability === 'true' || row.availability === true || row.availability === 'yes',
                };

                propertiesToCreate.push(propertyData);

            } catch (error: any) {
                errors.push({ row: index + 2, message: error.message });
            }
        }

        if (propertiesToCreate.length > 0) {
            await PropertyModel.insertMany(propertiesToCreate);
        }

        return {
            successCount: propertiesToCreate.length,
            errors: errors,
        };
    }
}
