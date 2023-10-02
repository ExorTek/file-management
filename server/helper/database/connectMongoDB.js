module.exports = async (mongoose, MONGO_URI) => {
    mongoose.set('strictQuery', null);
    await mongoose.connect(MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: true,
    })
};
