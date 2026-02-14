
import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import instance from '../../utils/Axios/Axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BulkUploadListing() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file first.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await instance.post('/property/bulk-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult(response.data.data);
            toast.success(`Processed ${response.data.data.successCount} properties.`);
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload file.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
            <ToastContainer position="bottom-center" />
            <PageBreadcrumb pageTitle="Bulk Upload Listing" />

            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg max-w-3xl mx-auto border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Excel File</h2>

                <div className="mb-6">
                    <p className="text-gray-600 mb-2">
                        Please upload an Excel file (.xlsx) containing property details.
                        Ensure the columns match the required format.
                    </p>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">XLSX, XLS (MAX. 10MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" accepts=".xlsx, .xls" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                    {file && (
                        <div className="mt-4 text-sm text-gray-700 font-medium">
                            Selected file: {file.name}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${loading || !file
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Uploading...' : 'Upload Properties'}
                </button>

                {result && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">Upload Result</h3>
                        <p className="text-green-600 mb-2">Successfully created: {result.successCount}</p>

                        {result.errors && result.errors.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-red-600 font-medium mb-2">Errors:</h4>
                                <div className="max-h-40 overflow-y-auto bg-white p-3 rounded border border-red-200">
                                    <ul className="list-disc list-inside text-sm text-red-600">
                                        {result.errors.map((err: any, idx: number) => (
                                            <li key={idx}>Row {err.row}: {err.message}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
