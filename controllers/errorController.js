exports.pageNotFoundError = (req, res) => {
    res.redirect('/html/error.html');
}

exports.internalServerError = (error, req, res, next) => {
    console.log(`ERROR occured: ${error.stack}`);
    res.redirect('/html/error.html');
}

