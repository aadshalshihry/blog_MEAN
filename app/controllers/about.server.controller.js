exports.render = function (req, res) {

  res.render('about', {
    title: 'about us',
    name: 'Roman'
  });
}