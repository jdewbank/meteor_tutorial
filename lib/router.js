Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', function () {
    this.render('tournaments');
});

Router.route('/:page', function () {
    this.render(this.params.page);
});