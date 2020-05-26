const tf = require('@tensorflow/tfjs-node')
const core = require('@tensorflow/tfjs-core')
const faceapi = require('face-api.js')
const canvas = require("canvas") 
const path = require('path');
const { Canvas, Image, ImageData } = canvas  
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

let modelsPath = path.join(__dirname, "../weights")

Promise.all([
    faceapi.nets.faceExpressionNet.loadFromDisk(modelsPath),
    faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath)
]).then(() => {
    console.log('loaded all the models from the disk')
})

function findMaxValue(array){
    var max = array[0];
    for (var i = 1; i < array.length; i++) {
      if (array[i].probability > max.probability) {
        max = array[i];
      }
    }
    return max;
}

module.exports = function(app){
    app.post('/detector', async (req,res, next) => {
        try {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            var base64Str = req.body.image
            var minConfidence = req.body.minConfidence
            const image = await canvas.loadImage(base64Str)
            const detections = await faceapi
                .detectAllFaces(image)
                .withFaceExpressions()
            var maxEmotion = {
                expression: 'default',
                probability: 0.0
            }
            if (detections.length > 0) {
                detections.forEach(e => {
                    const expr = e.expressions;
                    const sorted = expr.asSortedArray();
                    var emotions = sorted.filter(
                      expr => expr.probability > minConfidence
                    )
                    maxEmotion = findMaxValue(emotions)
                })
            }
            res.send(maxEmotion)
    
        } catch (error) {
            return next(error)
        }
    })
}