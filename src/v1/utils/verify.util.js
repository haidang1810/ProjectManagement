const schedule = require('node-schedule');

var verifyCodeList = [];
const createCode = async (length) => {
    let code = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++)
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    if (verifyCodeList.includes(code)) createCode(length);
    else return code;
};
const deleteCode = async (code) => {
    if (verifyCodeList.indexOf(code) >= 0)
        verifyCodeList.splice(verifyCodeList.indexOf(code), 1);
};
module.exports = {
    getCode: async () => {
        let code = await createCode(6);
        const expires = new Date(Date.now() + 3 * 60 * 1000);
        schedule.scheduleJob(expires, () => {
            deleteCode(code);
        });
        verifyCodeList.push(code);
        return await code;
    },
    checkCode: async (code) => {
        if (verifyCodeList.includes(code)) {
            deleteCode(code);
            return true;
        } else return false;
    },
};
