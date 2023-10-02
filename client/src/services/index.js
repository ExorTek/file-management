import apiAxios from "../lib/apiAxios";

/* ! AUTH */
export const loginFromApi = (data) => apiAxios.post('/auth/login', data);
export const changePasswordFromApi = (data) => apiAxios.put('/auth/changePassword', data);
export const sendLoggedInUserFromApi = () => apiAxios.get('/auth/me');

/* ! ADMIN */
export const getUsersFromApi = () => apiAxios.get('/admin/users');
export const getUserByIdFromApi = (id) => apiAxios.get(`/admin/user/${id}`);
export const registerFromApi = (data) => apiAxios.post('/admin/register', data);
export const createUserFromApi = (data) => apiAxios.post('/admin/user', data);
export const updateUserFromApi = (data) => apiAxios.put('/admin/user', data);

export const getUserAccessFoldersFromApi = (id) => apiAxios.get(`/admin/userAccessFolders/${id}`);
/* ! FILE */

export const uploadFromApi = (fileName, folderId, folderName, data) => {
    const formData = new FormData();
    formData.append('file', data);
    return apiAxios.post(`/file/upload`, formData, {
        params: {
            fileName,
            folderId,
            folderName
        },
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
export const getFilesByCreatorFromApi = () => apiAxios.get('/file/creator');
export const getFileByCreatorFromApi = (id) => apiAxios.get(`/file/creator/${id}`);
export const getFilesFromApi = () => apiAxios.get('/file');
export const getFileFromApi = (id) => apiAxios.get(`/file/${id}`);
export const deleteFileFromApi = (id) => apiAxios.delete(`/file/${id}`);
export const getBucketTotalSizeFromApi = () => apiAxios.get('/file/bucketSize');
export const getBucketTotalFilesFromApi = () => apiAxios.get('/file/bucketFiles');


export const checkFileNameFromApi = (fileName) => apiAxios.get(`/file/check/${fileName}`);

/* ! FOLDER */
export const getFoldersFromApi = () => apiAxios.get('/folder');
export const getFolderFromApi = (id) => apiAxios.get(`/folder/${id}`);
export const createFolderFromApi = (folderName) => apiAxios.post('/folder', folderName);
export const getFoldersByCreatorFromApi = () => apiAxios.get('/folder/creator');
export const updateFolderFromApi = (id, data) => apiAxios.put(`/folder/${id}`, data);
export const deleteFolderFromApi = (id) => apiAxios.delete(`/folder/${id}`);
export const getFoldersByAccessFromApi = () => apiAxios.get('/folder/accessedFolders');
