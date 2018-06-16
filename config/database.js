if (process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongodb://sa:start123@ds161700.mlab.com:61700/vidjotp'}
} else {
    module.exports = {mongoURI: 'mongoDB://localhost/vidjot-dev'}
}

//Lokale DB für entwicklung, mLab-db in Produktion