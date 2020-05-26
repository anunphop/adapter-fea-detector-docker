module.exports = function(app){
    app.get('/status', (req,res) => {
        res.json({status: 'UP'});
    })
}