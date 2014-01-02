/*!
  jQuery BitMonetForm Plugin 0.1

  BitMonet configuration form to manage/generate settings.
*/

;(function($)
{
  function BitMonetForm(el, options)
  {
    this.el = el;

    // default settings for form
    this.default_settings = {
      homepage_url: '',
      bitpay_apikey: '',
      paypal_email: '',
      company_name: '',
      company_logo: '',
      article_pass: 0.1,
      hour_pass: 0.15,
      day_pass: 0.2,
      paypal_orders_above: 0.27,
      free_content_count: 0,
      button_color: '#f7931a',
      button_text_color: '#ffffff',
      offer_paypal: 0,
      enable_tweet: 0,
      tweet_text: '',
      show_delay: 0
    }

    this.options = $.extend(true, {}, {

      // settings definition for controls on the form
      settings: this.default_settings,

      // text definition in the form
      texts: {
        connect: 'Connect',
        your_homepage: 'Your Homepage',
        bitpay_apikey: 'BitPay API Key',
        paypal_email: 'PayPal Email',
        find_yours: 'Find yours',
        here: 'here',
        optional: 'Optional',
        customize: 'Customize',
        monetize: 'Monetize',
        company: 'Company',
        company_logo: 'Company Logo',
        please_select: 'Please select',
        article_pass: 'Article pass',
        hour_pass: 'Hour pass',
        day_pass: 'Day pass',
        free_content_count: 'Free Content Count',
        free_content_count_desc: 'Number of articles user has to click before the BitMonet dialog box is shown.',
        button_color: 'Button Color',
        button_text_color: 'Button Text Color',
        sign: '$',
        offer_paypal: 'Offer PayPal checkout for orders above',
        paypal_merchant_rates: 'See PayPal merchant rates',
        enable_tweet: 'Enable tweet to read for Article pass',
        tweet_text: 'Custom tweet text',
        tweet_text_desc: 'Leave blank if you want to use a page title.',
        show_delay: 'Paywall show delay',
        show_delay_desc: 'Delay showing the paywall by a specified amount of time. By default the paywall is shown immediately.',
        seconds: 'second(s)'
      },

      // called when form is initialized
      onInit: $.noop
    }, options);

    this.makeTemplate();

    this.options.onInit.call(this);
  }

  // methods
  var proto = BitMonetForm.prototype;

  // create template and insert it into DOM
  proto.makeTemplate = function()
  {
    var texts = this.options.texts,
      template = '\
      <form class="bmf-form">\
        <input type="hidden" name="bitmonetform" value="1" />\
        <h3>' + texts.customize + '</h3>\
        <table class="bmf-form-table">\
          <tr>\
            <th scope="row"><label for="bmf_company_name">' + texts.company + '</label></th>\
            <td>\
              <input type="text" class="bmf-website" name="bmf_company_name" id="bmf_company_name" value="" />\
            </td>\
          </tr>\
          <tr>\
            <th scope="row"><label for="bmf_company_logo">' + texts.company_logo + '</label></th>\
            <td>\
              <input type="text" class="bmf-api-key" name="bmf_company_logo" placeholder="http://" id="bmf_company_logo" value="" />\
            </td>\
          </tr>\
          <tr>\
            <th scope="row"><label for="bmf_button_color">' + texts.button_color + '</label></th>\
            <td>\
              <input type="text" name="bmf_button_color" id="bmf_button_color" class="bmf-color-picker" value="" />\
            </td>\
          </tr>\
          <tr>\
            <th scope="row"><label for="bmf_button_text_color">' + texts.button_text_color + '</label></th>\
            <td>\
              <input type="text" name="bmf_button_text_color" id="bmf_button_text_color" class="bmf-color-picker" value="" />\
            </td>\
          </tr>\
        </table>\
        <h3>' + texts.monetize + '</h3>\
        <table class="bmf-form-table">\
          <tr>\
            <th scope="row"><label for="bmf_free_content_count">' + texts.free_content_count + '</label></th>\
            <td>\
              <input type="number" title="' + texts.free_content_count_desc + '" class="bmf-pass" name="bmf_free_content_count" id="bmf_free_content_count" value="" min="0" step="1" />\
            </td>\
          </tr>\
          <tr>\
            <th scope="row"><label for="bmf_article_pass">' + texts.article_pass + '</label></th>\
            <td>\
              <span class="bmf-sign">' + texts.sign + '</span>\
              <input type="number" class="bmf-pass" name="bmf_article_pass" id="bmf_article_pass" value="" min="0.01" step="0.01" />\
            </td>\
          </tr>\
          <tr>\
            <th scope="row"><label for="bmf_hour_pass">' + texts.hour_pass + '</label></th>\
            <td>\
              <span class="bmf-sign">' + texts.sign + '</span>\
              <input type="number" class="bmf-pass" name="bmf_hour_pass" id="bmf_hour_pass" value="" min="0.01" step="0.01" />\
            </td>\
          </tr>\
          <tr>\
            <th scope="row"><label for="bmf_day_pass">' + texts.day_pass + '</label></th>\
            <td>\
              <span class="bmf-sign">' + texts.sign + '</span>\
              <input type="number" class="bmf-pass" name="bmf_day_pass" id="bmf_day_pass" value="" min="0.01" step="0.01" />\
            </td>\
          </tr>\
          <tr>\
            <td class="bmf-checkbox" colspan="2">\
              <label>\
                <input type="checkbox" name="bmf_offer_paypal" id="bmf_offer_paypal" value="1" />\
                ' + texts.offer_paypal + '\
              </label>\
              <span class="bmf-sign">' + texts.sign + '</span>\
              &nbsp;<input type="number" class="bmf-pass" name="bmf_paypal_orders_above" id="bmf_paypal_orders_above" value="" min="0.01" step="0.01" />\
              <br /><span class="bmf-helptext">\
                ' + texts.paypal_merchant_rates + '\
                <a href="https://www.paypal.com/webapps/mpp/merchant-fees" target="_blank">' + texts.here + '</a>\
              </span>\
            </td>\
          </tr>\
          <tr>\
            <td class="bmf-checkbox" colspan="2">\
              <label>\
                <input type="checkbox" name="bmf_enable_tweet" id="bmf_enable_tweet" value="1" />\
                ' + texts.enable_tweet + '\
              </label>\
            </td>\
          </tr>\
          <tr>\
            <th scope="row"><label for="bmf_tweet_text">' + texts.tweet_text + '</label></th>\
            <td>\
              <input type="text" title="' + texts.tweet_text_desc + '" class="bmf-api-key" name="bmf_tweet_text" id="bmf_tweet_text" value="" />\
            </td>\
          </tr>\
          <tr>\
            <th scope="row"><label for="bmf_show_delay">' + texts.show_delay + '</label></th>\
            <td>\
              <input type="number" title="' + texts.show_delay_desc + '" class="bmf-pass" name="bmf_show_delay" id="bmf_show_delay" value="" min="0" step="1" /> ' + texts.seconds + '\
            </td>\
          </tr>\
        </table>\
        <h3>' + texts.connect + '</h3>\
        <table class="bmf-form-table">\
          <tr>\
            <th scope="row"><label for="bmf_homepage_url">' + texts.your_homepage + '</label></th>\
            <td>\
              <input type="text" class="bmf-website" name="bmf_homepage_url" id="bmf_homepage_url" value="" placeholder="www.yourwebsite.com" />\
            </td>\
          </tr>\
          <tr>\
            <th scope="row">\
              <label for="bmf_bitpay_apikey">\
                ' + texts.bitpay_apikey + '\
                <span>\
                  ' + texts.find_yours + '\
                  <a href="https://bitpay.com/api-keys" target="_blank">' + texts.here + '</a>\
                </span>\
              </label>\
            </th>\
            <td valign="top">\
              <input type="text" class="bmf-api-key" name="bmf_bitpay_apikey" id="bmf_bitpay_apikey" value="" />\
            </td>\
          </tr>\
          <tr>\
            <th scope="row">\
              <label for="bmf_paypal_email">\
                ' + texts.paypal_email + '\
                <span>\
                  ' + texts.optional + '\
                </span>\
              </label>\
            </th>\
            <td valign="top">\
              <input type="text" class="bmf-api-key" name="bmf_paypal_email" id="bmf_paypal_email" value="" />\
            </td>\
          </tr>\
        </table>\
      </form>';

    this.el.html(template);

    // get controls from template
    var $form = $('form', this.el);

    this.form = { this: $form }

    for(var i in this.default_settings)
      this.form[i] = $('#bmf_' + i, $form);

    this.setSettings();

    // bind controls
    $.minicolors.defaults.control = 'wheel';

    this.form.button_color.minicolors();
    this.form.button_text_color.minicolors();
  }

  // set settings for controls on the form
  proto.setSettings = function(settings)
  {
    if (typeof settings !== 'object')
      settings = this.options.settings;

    for(var i in settings)
      if (this.form.hasOwnProperty(i))
      {
        if (this.form[i][0].type == 'checkbox')
          this.form[i].prop('checked', parseInt(settings[i]));
        else
          this.form[i].val(settings[i]);
      }
  }

  // get settings
  proto.getSettings = function()
  {
    var settings = {};

    for(var i in this.default_settings)
    {
      if (this.form[i][0].type == 'checkbox')
        settings[i] = this.form[i].prop('checked')?1:0;
      else
        settings[i] = this.form[i].val();
    }

    return settings;
  }

  // generate bitmonet init script
  proto.getCode = function(extend)
  {
    var settings = this.getSettings(),
      sign = this.options.texts.sign,
      bitmonet_settings = $.extend(true, {
        company: settings.company_name,
        logo: settings.company_logo,
        homeLink: settings.homepage_url,
        numberClickedNeedBuy: settings.free_content_count,
        buttonColor: settings.button_color,
        buttonTextColor: settings.button_text_color,
        bitpayAPIKey: settings.bitpay_apikey,
        paypalEmail: settings.paypal_email,
        paypalOrderAbove: settings.paypal_orders_above,
        enableTweet: settings.enable_tweet,
        tweetText: settings.tweet_text,
        enablePaypal: settings.offer_paypal,
        showDelay: settings.show_delay,
        optionData: [
          {
            value: settings.article_pass * 100
          },
          {
            value: settings.hour_pass * 100
          },
          {
            value: settings.day_pass * 100
          }
        ]
      }, extend),
      code = '$.BitMonet(#settings);';

    return code.replace('#settings', JSON.stringify(bitmonet_settings, null, 2));
  }

  // do validation of controls on the form
  proto.doValidation = function()
  {
    var errors = [];

    $('input[type=text], input[type=number]', this.el).removeClass('bmf-error');

    if (this.form.homepage_url.val().length == 0)
      errors.push('homepage_url');

    if (this.form.bitpay_apikey.val().length == 0)
      errors.push('bitpay_apikey');

    if (this.form.company_name.val().length == 0)
      errors.push('company_name');

    var free_content_count = this.form.free_content_count.val();
    if (free_content_count < 0 || isNaN(free_content_count))
      errors.push('free_content_count');

    if (this.checkPriceInput(this.form.article_pass.val()))
      errors.push('article_pass');

    if (this.checkPriceInput(this.form.hour_pass.val()))
      errors.push('hour_pass');

    if (this.checkPriceInput(this.form.day_pass.val()))
      errors.push('day_pass');

    if (this.checkPriceInput(this.form.paypal_orders_above.val()))
      errors.push('paypal_orders_above');

    var show_delay = this.form.show_delay.val();
    if (show_delay < 0 || isNaN(show_delay))
      errors.push('show_delay');

    for(var i in errors)
      this.form[errors[i]].addClass('bmf-error');

    if (errors.length > 0)
    {
      $('html, body').animate({ scrollTop: this.el.offset().top });
      return false;
    }

    return true;
  }

  proto.checkPriceInput = function(value)
  {
    return isNaN(value) || value < 0.01?true:false;
  }


  // extend jquery
  $.fn.extend({
    BitMonetForm: function(options)
    {
      // minicolors plugin is required
      if (!$.minicolors)
      {
        throw 'jQuery MiniColors is required!';
        return this;
      }

      var inst = this.data('BitMonetForm');

      // if valid instance then perform calls on the class
      if (inst && options)
      {
        if (inst[options])
          return inst[options].apply(inst, Array.prototype.slice.call(arguments, 1));

        return inst;
      }
      else
      {
        inst = new BitMonetForm(this, options);
        this.data('BitMonetForm', inst);
      }

      // keep chain
      return this;
    }
  });

})(jQuery);