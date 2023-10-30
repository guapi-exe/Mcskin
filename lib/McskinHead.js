const sharp = require('sharp');


class McskinHead {
    async getimage(url,size) {
        try {
            const cropParams = [
                {left: 8, top: 8, width: 8, height: 8},
                {left: 40, top: 8, width: 8, height: 8}
            ];
            const resizeParams = [
                {width: size, height: size},
                {width: size *(9/8), height: size *(9/8)}
            ];
            let downimage = await downloadImage(url)
            const buffers = [];

            for (let i = 0; i < cropParams.length; i++) {
                // 创建一个sharp对象
                const image = sharp(downimage)
                    .toFormat('png')
                    .modulate({
                        brightness: 1,
                        saturation: 1
                    })
                    .toColourspace('srgb')
                    .extract(cropParams[i])
                    .resize(resizeParams[i].width, resizeParams[i].height, {
                        fit: 'fill',
                        kernel: sharp.kernel.nearest
                    });

                // 获取图片的buffer并添加到数组中
                const buffer = await image.toBuffer();
                buffers.push(buffer);
                //console.log('Image processed successfully');
            }

            // 将两个图片合成为一个并获取buffer
            const compositeBuffer = await sharp(buffers[1])
                .toFormat('png')
                .png({quality: 10})
                .composite([
                    {
                        input: buffers[0],
                        left: size/16,
                        top: size/16,
                        blend: 'overlay'
                    }
                ])
                .toBuffer();

            //console.log('Image composited successfully');

            return [buffers[0], buffers[1], compositeBuffer];
        } catch (err) {
            //console.error(err);
        }
    }


}
async function downloadImage(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        const arrayBuffer = await blob.arrayBuffer();
        // 返回Buffer对象
        return Buffer.from(arrayBuffer);
    } catch (err) {
        // 处理错误
        //console.error(err);
    }
}



module.exports = McskinHead