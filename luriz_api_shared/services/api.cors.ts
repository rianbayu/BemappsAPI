module.exports = {
    settings: {
		cors: {            
            origin: "*",            
            methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],            
            allowedHeaders: "*",            
            // exposedHeaders: [],            
            // credentials: false,            
            // maxAge: 3600
        },
    }
}