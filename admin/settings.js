jQuery(function($)
{
  var $spinner = $('.spinner'),
    $button_color = $('input[name=button_color]'),
    $button_text_color = $('input[name=button_text_color]'),
    $save_button = $('input[name=save_settings]'),
    $form = $('#settings_form'),
    $save_message = $('.save_message'),
    $company_logo = $('input[name=company_logo]'),
    $show_preview = $('.show_preview');


  // add color picker
  $.minicolors.defaults.control = 'wheel';

  $button_color.minicolors();
  $button_text_color.minicolors();


  // handle selection of company logo
  var logo_selector = wp.media({
    title: BitMonet.text.media_upload_title,
    library: { type: 'image' },
    multiple: false
  });

  logo_selector.on('select', function()
  {
    var image = logo_selector.state().get('selection').first().toJSON();

    $show_preview.attr('href', image.url).show();
    $company_logo.val(image.url);
  });

  $('input[name=logo_picker]').on('click', function()
  {
    logo_selector.open();
  });


  // save settings
  function showLoader(v)
  {
    if (v)
      $spinner.show();
    else
      $spinner.hide();

    $save_button.attr('disabled', v);
  }

  $save_button.on('click', function(e)
  {
    e.preventDefault();

    showLoader(true);

    $.post(BitMonet.action_url, $form.serializeArray(), function(r)
    {
      showLoader(false);

      $('input[type=text], input[type=number]').removeClass('error');

      if (r.errors && r.errors.length > 0)
      {
        for(var i in r.errors)
          $('input[name=' + r.errors[i] + ']').addClass('error');
      }
      else
      {
        $save_message.show();
        window.setTimeout(function()
        {
          $save_message.fadeOut(400);
        }, 4000);
      }

    }).error(function()
    {
      showLoader(false);
      alert(BitMonet.text.ajax_error);
    });

    return false;
  });

});