 
$(window).on('load', function(){checkCookie();})

//start
let inputVal = '';
$(document).on('input', '.start input', function()
{
    if($('.start input').val() != '') $('.start p').html("Kliknij enter, aby zatwierdzić");
    else  $('.start p').html("Pole nie może być puste");

    inputVal = $('.start input').val();
    Cookies.set('user', inputVal, {expires: 365, path: ''});
});

$(document).on('keypress', '.start input', function(e)
{
    if(e.which == 13 && $('.start p').html() == "Kliknij enter, aby zatwierdzić")
    {
        $('.start').slideUp();
        $('footer span').hide();
        $('header h2').html("Oto Twoja lista zadań, "+inputVal);
        $('header p, footer p, .list > p, .list div').show();
    }
});

// adding task
$('.list').on('click', 'span.add', function() 
{  
    $(this).hide();
    $(this).parents('div').children('.adding').show();
    $(this).parents('div').children('.adding').children('input')
    .attr('placeholder', 'Nazwa zadania...')
    .val('').focus();
});

$('.list').on('click', 'i.fa-xmark', function()
{
    $(this).parents('div').children('.add').show();
    $(this).parents('span').hide();
});

$('.list').on('click', 'i.fa-check', function(){ accept($(this)); });
$(document).on('keypress', '.list input', function(e){ if(e.which == 13) accept($(this)); });

// task transfer
let html = '';
let remove = '';
let removeAll = '';
$('.list').on('click', 'li', function()
{
    $('main, header, footer').fadeTo(100, 0.5).css('pointer-events', 'none');
    let category = $(this).parents('div').attr('class');
    $('.move').show();
    $('.move li').css('color', 'rgb(142, 178, 255)').css('pointer-events', 'auto');
    $('.move li.'+category).css('color', 'gray').css('pointer-events', 'none');
    html = $(this).html();
    remove = $(this);
    removeAll = $(this).parents('div').children('ul').children('li');
});

$('.move p:last-child').click(function()
{
    back('.move');
});

$('.move .remove').click(function()
{
    remove.remove();
    updateCookie();
    back('.move');
});

$('.move .removeAll').click(function()
{
    removeAll.remove();
    updateCookie();
    back('.move');
});

$('.move li').click(function() 
{ 
    let category = $(this).attr('class');
    $('<li>'+html+'</li>').appendTo('div.'+category+' ul');
    remove.remove();
    html = '';
    remove = '';
    removeAll = '';
    updateCookie();
    back('.move');
});

// reset
$('footer p.reset').click(function()
{
    $('main, header, footer').fadeTo(100, 0.5).css('pointer-events', 'none');
    $('div.reset').show();
});

$('div.reset p:last-child').click(function()
{
    back('div.reset');
});

$('div.reset .remove').click(function()
{
    Cookies.remove('user', { path: '' });
    Cookies.remove('list', { path: '' });
    location.reload();
});

// my functions
function accept(element) 
{
    let input = element.parents('div').children('.adding').children('input');
    if (input.val() != '') {
        element.parents('div').children('ul').append('<li>' + input.val() + '</li>');
        element.parents('div').children('.adding').hide();
        element.parents('div').children('.add').show();
        updateCookie();
    }
    else input.attr('placeholder', 'Wypełnij pole...');
}

function back(element) 
{
    $(element).hide();
    $('main, header, footer').fadeTo(100, 1).css('pointer-events', 'auto');
}

function updateCookie() 
{
    if (Cookies.get('list') != null) Cookies.remove('list');
    Cookies.set('list', $('.list').html(), { expires: 365, path: '' });
}

function checkCookie() 
{
    let user = Cookies.get('user');
    if (user != null) {
        let list = Cookies.get('list');
        if (list == null) $('.list div').show();
        else $('.list').html(list).show();
        $('.list > p').hide();
        $('header h2').show().html("Oto Twoja lista zadań, " + user);
        $('header p').show();
        $('footer .reset').show();
    }

    else {
        $('.start').show();
        $(".start input").focus();
        $('header h2').show();
        $('footer span').show();
    }
}

