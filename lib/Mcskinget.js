const axios = require("axios");
class Mcskinget {
    async getuuid(name){
        return new Promise(async (resolve, reject) => {
            await axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`)
                .then(async response => {
                    let data = await response.data
                    resolve(data.id)

                })
                .catch(error => {
                    reject(error)
                })
        })
    }
    async getskin(uuid){
        return new Promise(async (resolve, reject) => {
            await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
                .then(async response => {
                    let data = await response.data
                    let base64 = data.properties[0].value
                    const buff = Buffer.from(base64, 'base64');
                    const str = buff.toString('utf-8');
                    const jsonskin = JSON.parse(str)
                    resolve(jsonskin)

                })
                .catch(error => {
                    reject(error)
                })
        })
    }

}
module.exports = Mcskinget