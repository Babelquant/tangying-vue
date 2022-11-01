module.exports = {
    devServer: {
        // port: 8888,
        // open: true,
        proxy: {
            '/tangying': {
                target: 'http://localhost:8000',
                // secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/tangying': ''
                }
            }
        }
    }
}