
import * as xlsx from 'xlsx';

const data = [
    {
        property_name: 'Test Property 1',
        description: 'A test property created via bulk upload',
        rate: '15000',
        category: 'rent',
        amenities: 'Wifi, Parking',
        services: 'Cleaning, Security',
        images: 'https://placehold.co/600x400',
        videos: '',
        furnishing_type: 'Semi-furnished',
        city: 'Test City',
        state: 'Test State',
        address: '123 Test St',
        flat_no: 'A-101',
        bed: 2,
        bathroom: 2,
        area: '1200',
        availability: true,
    },
    {
        property_name: 'Test Property 2',
        description: 'Another test property',
        rate: '5000',
        category: 'pg',
        amenities: 'Wifi',
        services: 'Cleaning',
        images: 'https://placehold.co/600x400',
        videos: '',
        furnishing_type: 'Fully furnished',
        city: 'Test City',
        state: 'Test State',
        address: '456 Test St',
        flat_no: 'B-202',
        bed: 1,
        bathroom: 1,
        area: '800',
        availability: true,
        perPersonPrice: '5000',
        totalCapacity: '4'
    }
];

const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(data);
xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

xlsx.writeFile(wb, 'test_properties.xlsx');
console.log('Test Excel file created: test_properties.xlsx');
