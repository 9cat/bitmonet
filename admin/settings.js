jQuery(function($)
{
  var $spinner = $('.spinner'),
    $preview_button = $('input[name=preview_button]'),
    $save_button = $('input[name=save_settings]'),
    $save_message = $('.save_message'),
    $form = $('#bitmonetform');

  function getBasename(url)
  {
    return url.substr(url.lastIndexOf('/') + 1);
  }


  // init bitmonet settings form
  $form.BitMonetForm({
    settings: BitMonet.settings,
    texts: BitMonet.texts,
    onInit: function()
    {
      var form = this;

      // add company logo selector from wordpress
      $('<input type="button" class="button button-secondary" name="logo_selector" value="' + BitMonet.text.please_select + '" /> <a href="" class="logo_filename" target="_blank"></a>')
        .insertAfter(form.form.company_logo.attr('type', 'hidden'));

      var logo_selector = wp.media({
        title: BitMonet.text.media_upload_title,
        library: { type: 'image' },
        multiple: false
      }),
        $logo_filename = $('.logo_filename'),
        url = form.form.company_logo.val();

      $logo_filename.text(getBasename(url)).attr('href', url);

      logo_selector.on('select', function()
      {
        var image = logo_selector.state().get('selection').first().toJSON();

        form.form.company_logo.val(image.url);
        $logo_filename.text(getBasename(image.url)).attr('href', image.url);
      });

      $('input[name=logo_selector]').on('click', function()
      {
        logo_selector.open();
      });

      // preview
      $preview_button.on('click', function()
      {
        if (!form.doValidation())
          return;

        var code = '(function($) { ' + form.getCode({ preview: true }) + ' })(jQuery)';

        $('<script></script>').text(code).appendTo($('body'));

        return false;
      });
    }
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

    if (!$form.BitMonetForm('doValidation'))
      return;

    showLoader(true);
    $.post(BitMonet.action_url, $form.BitMonetForm('getSettings'), function(r)
    {
      showLoader(false);

      $save_message.show();
      window.setTimeout(function()
      {
        $save_message.fadeOut(400);
      }, 4000);

    }).error(function()
    {
      showLoader(false);
      alert(BitMonet.text.ajax_error);
    });

    return false;
  });

});