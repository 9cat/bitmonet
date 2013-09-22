jQuery(function($)
{
  var $inlineedit = $('#inlineedit'),
    $checkbox_group = $('.inline-edit-col-right .inline-edit-group', $inlineedit).first(),
    $bulkedit = $('#bulk-edit'),
    $save_button_bulk = $('#bulk_edit', $bulkedit),
    $bulk_group = $('.inline-edit-col-right .inline-edit-col', $bulkedit),
    $inline_author = $('.inline-edit-author', $bulk_group),
    $pub_actions = $('#misc-publishing-actions');

  // create monetize label
  var $monetize_label = $('<label class="alignleft" style="margin-left: .5em;"></label>'),
    $monetize_checkbox = $('<input type="checkbox" name="bitmonet-monetize" value="1" />'),
    $monetize_title = $('<span class="checkbox-title" style="margin-left: 2px; font-weight: bold;"></span>').text(BitMonet.text.monetize_with_bitmonet);

  $monetize_label.append($monetize_checkbox).append($monetize_title);

  // add monetize checkbox to post inline edit form
  if ($inlineedit.length > 0)
  {
    $checkbox_group.append($monetize_label.clone());

    function init_inlineedit()
    {
      var $inline_link = $('#the-list a.editinline:not(.bitmonet_inline)');

      $inline_link.addClass('bitmonet_inline').on('click', function()
      {
        var $row = $(this).closest('tr'),
          post_id = $row.attr('id').split('-')[1],
          $hidden = $('input[name=bitmonet_monetize]', $row),
          waitForElements = function()
        {
          var $edit_row = ('#edit-' + post_id),
            $checkbox = $('input[name=bitmonet-monetize]', $edit_row);

          if ($checkbox.length == 0)
            window.setTimeout(waitForElements, 200);
          else
          {
            var current_val = $hidden.val();

            $checkbox.attr('checked', $hidden.val() == 1?true:false).on('click', function()
            {
              current_val = $checkbox.prop('checked')?1:0;
              $hidden.val(current_val);
            });

            $('a.save', $edit_row).on('click', function()
            {
              $.post(BitMonet.action_url, {
                post_id: post_id,
                monetize: current_val
              }, function(r) { });
            });
          }
        }

        waitForElements();
      });
    }

    $(document).ajaxStop(init_inlineedit);

    init_inlineedit();
  }

  // bulk inline edit form
  if ($bulkedit.length > 0)
  {
    var $author = $inline_author.clone(true).removeClass('inline-edit-author').addClass('alignleft');
    $inline_author.remove();

    $bulk_group.prepend($('<div class="inline-edit-group"></div>').append($author).append($monetize_label.clone().removeClass('alignleft').addClass('alignright')));
  }

  // add checkbox to add/edit post page
  if ($pub_actions.length > 0)
  {
    var $label = $monetize_label.clone(),
      $checkbox = $('input[type=checkbox]', $label),
      $monetize_hidden = $('input[name=bitmonet_monetize]');

    $checkbox.attr('checked', $monetize_hidden.val() == 1?true:false).on('change', function()
    {
      $monetize_hidden.val($checkbox.prop('checked')?1:0);
    });

    $('<div class="misc-pub-section"></div>').append($label.css('margin-left', '0')
      .css('margin-top', '2px').removeClass('alignleft')).appendTo($pub_actions);
  }

});