/**
 *
 * @param input
 * @returns {{success: boolean, message: string}}
 */
export const validateObject = (input) => {
    if (typeof input !== 'object') new Error('Input must be an object');
    let data = {
        success: false,
        message: ''
    };
    Object.keys(input).forEach(key => {
        if (!input[key]) {
            data.message = `${key} is cannot be left blank!`;
            return data;
        }
        if (input[key] === undefined) {
            data.message = `${key} is undefined!`;
            return data;
        }
        if (input[key] === null) {
            data.message = `${key} is null!`;
            return data;
        }
        if (input[key] === '') {
            data.message = `${key} is empty!`;
            return data;
        }
        data.success = true;
        return data;
    });
    return data;
}